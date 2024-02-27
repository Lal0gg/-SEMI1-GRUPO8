import base64
from datetime import datetime
import io
from typing import Optional
import boto3
import os
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from psycopg2 import pool
import magic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from hashlib import md5

load_dotenv()
endpoint = os.getenv('ENDPOINT')
db_port = os.getenv("DB_PORT")
db_user = os.getenv('DB_USER')
db_pass = os.getenv('DB_PASS')
db_name = os.getenv('DB_NAME')
rds_region = os.getenv('RDS_REGION')
s3_region = os.getenv('S3_REGION')
bucket = os.getenv('BUCKET_NAME')
db_access_key = os.getenv('DB_ACCESS_KEY')
db_secret_key = os.getenv('DB_SECRET_KEY')
s3_access_key = os.getenv('S3_ACCESS_KEY')
s3_secret_key = os.getenv('S3_SECRET_KEY')

db_client = boto3.client(
    service_name = 'rds',
    region_name = rds_region,
    aws_access_key_id = db_access_key,
    aws_secret_access_key = db_secret_key,
)

s3_client = boto3.client(
    service_name = 's3',
    aws_access_key_id = s3_access_key,
    aws_secret_access_key = s3_secret_key,
)

conn_pool = pool.SimpleConnectionPool(1,20, host=endpoint, port=db_port, database=db_name, user=db_user, password=db_pass,sslrootcert="SSLCERTIFICATE")


class UserCreation(BaseModel):
    username: str
    name: str
    password: str
    photo_base64: str

class User(BaseModel):
    id: int
    username:str
    name:str
    profile_picture_url:str

class UserUpdate(BaseModel):
    password:str
    user_id:int
    new_username:Optional[str]= None
    new_name:Optional[str]= None
    new_photo_base64:Optional[str]= None

class Photo(BaseModel):
    photo_id: int
    photo_name: str
    photo_url: str

class PhotoUpload(BaseModel):
    photo_name: str
    photo_base64: str
    album_id: int

class Album(BaseModel):
    album_name: str
    album_id: int

class AlbumList(BaseModel):
    albums:list[Album]

class AlbumPhotos(BaseModel):
    album_id:int
    photos:list[Photo]

class AlbumCreation(BaseModel):
    album_name:str
    user_id:int

class AlbumDeletion(BaseModel):
    album_id:int

class AlbumUpdate(BaseModel):
    album_id:int
    album_name:str

class Message(BaseModel):
    message: str

class Login(BaseModel):
    username:str
    password:str
    
class LoginResponse(BaseModel):
    correct:bool

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

@app.get('/info',status_code=200,responses={200: {"model": Message}})
def info():
    return JSONResponse(status_code=200, content={"message":"server python"})

@app.post('/signin', status_code=201,responses={201: {"model": Message}})
def signin(user:UserCreation):
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        md5_pass = md5((user.password).encode('utf-8')).hexdigest()
        cur.execute("INSERT INTO userr VALUES (DEFAULT,%s, %s, %s);",[user.username,user.name,md5_pass])

        cur.execute("SELECT id_user FROM userr WHERE username = %s;",[user.username])
        query_results = cur.fetchall()
        id = query_results[0][0]
        cur.execute("INSERT INTO album VALUES (DEFAULT, %s, %s,1::bit(1));",["Fotos de Perfil",id])

        
        cur.execute("SELECT id_album FROM album WHERE id_user= %s;",[id])
        query_results = cur.fetchall()
        album_id = query_results[0][0]
        f = base64.b64decode(user.photo_base64)
        mt = magic.from_buffer(f,mime=True)
        bucket_location = s3_client.get_bucket_location(Bucket=bucket)
        key_name = "Fotos_Perfil/" + datetime.now().strftime('%Y_%m_%d_%H-%M-%S.%f')
        s3_client.upload_fileobj(io.BytesIO(f),bucket,key_name, ExtraArgs={'ContentType':mt});
        object_url = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
            bucket_location['LocationConstraint'],
            bucket,
            key_name
        )
        cur.execute("INSERT INTO photo VALUES (DEFAULT,%s,%s,1::bit(1),%s)",[key_name,object_url,album_id])
        print(object_url)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500,detail=e.__str__())
    conn.commit()
    conn_pool.putconn(conn)

    return JSONResponse(status_code=201, content={"message": "user created"})

@app.get('/get_user/{username}',status_code=200)
def get_user(username:str) -> User:
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("SELECT id_user,username,name FROM userr WHERE username = %s;",[username])
        query_results = cur.fetchall()
        if len(query_results) == 0 :
            raise Exception("Could not find user in database")
        usr = User(
            id = int(query_results[0][0]),
            username = str(query_results[0][1]),
            name= str(query_results[0][2]),
            profile_picture_url=""
        )
        cur.execute("SELECT link FROM photo JOIN album ON album.id_album = photo.id_album WHERE album.id_user = %s AND album.isProfilePictureAlbum = 1::bit(1) AND photo.isProfilePicture = 1::bit(1);",[usr.id])
        usr.profile_picture_url= str(cur.fetchall()[0][0])
        conn_pool.putconn(conn)
        return usr
    except Exception as e:
        raise HTTPException(status_code=500,detail=e.__str__())

@app.get('/get_album_list/{username}', status_code=200)
def get_album_list(username:str)->AlbumList:
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("SELECT album.id_album,album.name FROM album JOIN userr ON userr.id_user = album.id_user WHERE userr.username = %s;",[username])
        query_results = cur.fetchall()
        if len(query_results) == 0 :
            raise Exception("Could not find user in database")
        album_list = AlbumList(albums=[])
        for album in query_results:
            album_list.albums.append(Album(album_id=int(album[0]),album_name=str(album[1])))
        return album_list
    except Exception as e:
        raise HTTPException(status_code=500,detail=e.__str__())

@app.get('/get_album_photos/{id_album}',status_code=200)
def get_album_photos(id_album:int) -> AlbumPhotos:
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("SELECT id_photo,name,link FROM photo WHERE id_album = %s;",[id_album])
        query_results = cur.fetchall()
        photo_list = AlbumPhotos(album_id=id_album,photos=[])
        for photo in query_results:
            photo_list.photos.append(Photo(
                photo_id=int(photo[0]),
                photo_name=str(photo[1]),
                photo_url=str(photo[2])
            ))
        return photo_list
    except Exception as e:
        raise HTTPException(status_code=500,detail=e.__str__())

@app.post('/upload_photo',status_code=201,responses={201: {"model": Message}})
def upload_photo(photo:PhotoUpload):
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        f = base64.b64decode(photo.photo_base64)
        mt = magic.from_buffer(f,mime=True)
        bucket_location = s3_client.get_bucket_location(Bucket=bucket)
        key_name = "Fotos_Publicadas/" + datetime.now().strftime('%Y_%m_%d_%H-%M-%S.%f')
        s3_client.upload_fileobj(io.BytesIO(f),bucket,key_name, ExtraArgs={'ContentType':mt});
        object_url = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
            bucket_location['LocationConstraint'],
            bucket,
            key_name
        )
        cur.execute("INSERT INTO photo VALUES (DEFAULT,%s,%s,0::bit(1),%s)",[photo.photo_name,object_url,photo.album_id])
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500,detail=e.__str__())
    conn.commit()
    conn_pool.putconn(conn)
    return JSONResponse(status_code=201, content={"message": "photo created"})

@app.post('/create_album', status_code=201,responses={201: {"model": Message}})
def create_album(album:AlbumCreation):
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("INSERT INTO album VALUES (DEFAULT,%s,%s,0::bit(1))",[album.album_name,album.user_id])
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500,detail=e.__str__())
    conn.commit()
    conn_pool.putconn(conn)
    return JSONResponse(status_code=201, content={"message": "album created"})

@app.post('/delete_album', status_code=200,responses={200: {"model": Message}})
def delete_album(album:AlbumDeletion):
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM album WHERE id_album = %s",[album.album_id])
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500,detail=e.__str__())
    conn.commit()
    conn_pool.putconn(conn)
    return JSONResponse(status_code=201, content={"message": "album deleted"})

@app.post('/edit_album', status_code=200,responses={200: {"model": Message}})
def edit_album(album:AlbumUpdate):
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("UPDATE album SET name = %s WHERE id_album = %s",[album.album_name, album.album_id])
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500,detail=e.__str__())
    conn.commit()
    conn_pool.putconn(conn)
    return JSONResponse(status_code=201, content={"message": "album updated"})

@app.post('/update_profile', status_code=200,responses={200: {"model": Message}})
def update_profile(user:UserUpdate):
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()

        md5_pass = md5((user.password).encode('utf-8')).hexdigest()
        cur.execute("SELECT * FROM userr WHERE id_user = %s AND password = %s",[user.user_id,md5_pass])
        if len(cur.fetchall()) == 0:
            raise Exception("Incorrect Password")
        if user.new_username and user.new_username != "":
            cur.execute("UPDATE userr SET username = %s WHERE id_user = %s",[user.new_username,user.user_id])
        if user.new_name and user.new_name != "":
            cur.execute("UPDATE userr SET name = %s WHERE id_user = %s",[user.new_name,user.user_id])
        if user.new_photo_base64 and user.new_photo_base64 != "":
            cur.execute("SELECT id_album FROM album WHERE id_user = %s AND isProfilePictureAlbum = 1::bit(1)",[user.user_id])
            album_id = cur.fetchone()[0]
            cur.execute("UPDATE photo SET isProfilePicture = 0::bit(1) WHERE isProfilePicture = 1::bit(1) AND id_album = %s", [album_id])
            f = base64.b64decode(user.new_photo_base64)
            mt = magic.from_buffer(f,mime=True)
            bucket_location = s3_client.get_bucket_location(Bucket=bucket)
            key_name = "Fotos_Perfil/" + datetime.now().strftime('%Y_%m_%d_%H-%M-%S.%f')
            s3_client.upload_fileobj(io.BytesIO(f),bucket,key_name, ExtraArgs={'ContentType':mt});
            object_url = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
                bucket_location['LocationConstraint'],
                bucket,
                key_name
            )
            cur.execute("INSERT INTO photo VALUES (DEFAULT,%s,%s,1::bit(1),%s)",[key_name,object_url,album_id])
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500,detail=e.__str__())
    conn.commit()
    conn_pool.putconn(conn)
    return JSONResponse(status_code=201, content={"message": "user updated"})

@app.post('/login', status_code=200)
def login(creds:Login) -> LoginResponse:
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        md5_pass = md5((creds.password).encode('utf-8')).hexdigest()
        cur.execute("SELECT 0 FROM userr WHERE username = %s AND password = %s",[creds.username,md5_pass])
        if len(cur.fetchall()) == 0:
            return LoginResponse(correct=False)
        return LoginResponse(correct=True)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500,detail=e.__str__())
