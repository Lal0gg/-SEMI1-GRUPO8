from datetime import datetime
from fastapi.exceptions import HTTPException
from psycopg2 import pool
from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from hashlib import md5
import boto3
import magic
import os
import base64
import io


import classes

load_dotenv()
endpoint = os.getenv('ENDPOINT')
db_port = os.getenv('DB_PORT')
db_user = os.getenv('DB_USER')
db_pass = os.getenv('DB_PASS')
db_name = os.getenv('DB_NAME')

s3_access_key = os.getenv('S3_ACCESS_KEY')
s3_secret_key = os.getenv('S3_SECRET_KEY')
s3_region = os.getenv('S3_REGION')
bucket = os.getenv('BUCKET_NAME')

s3_client = boto3.client(
    service_name = 's3',
    aws_access_key_id = s3_access_key,
    aws_secret_access_key = s3_secret_key,
)

rekognition_client = boto3.client(
    service_name = 'rekognition',
    aws_access_key_id = os.getenv('REKOGNITION_ACCESS_KEY'),
    aws_secret_access_key = os.getenv('REKOGNITION_SECRET_KEY'),
    region_name = 'us-east-1'
)

translate_client = boto3.client(
    service_name = 'translate',
    aws_access_key_id = os.getenv('TRANSLATE_ACCESS_KEY'),
    aws_secret_access_key = os.getenv('TRANSLATE_SECRET_KEY')
)

InvalidParameterException = rekognition_client.exceptions.InvalidParameterException

conn_pool = pool.SimpleConnectionPool(1, 20, user=db_user, password=db_pass, host=endpoint, port=db_port, database=db_name, sslrootcert="SSLCERTIFICATE")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post('/signin',status_code=201, responses={201:{"model":classes.Message}})
def signin(user: classes.UserCreate):
    conn = conn_pool.getconn()
    key_name = "Fotos_Perfil/" + datetime.now().strftime('%Y_%m_%d_%H-%M-%S.%f')
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        md5_pass = md5(user.password.encode('utf-8')).hexdigest()
        cur.execute("""
            INSERT INTO
                usr(id_user,username,name,password)
            VALUES
                (DEFAULT,%s,%s,%s)
            RETURNING
                id_user
        """,[user.username,user.name,md5_pass])

        query_results = cur.fetchall()
        id_user = query_results[0][0]

        cur.execute("""
            INSERT INTO tag
                (id_tag,name) 
            VALUES 
                (DEFAULT,%s)
            ON CONFLICT(name) DO UPDATE
                SET id_tag = tag.id_tag
            RETURNING id_tag
        """, ['Fotos de Perfil'])

        query_results = cur.fetchall()
        id_tag = query_results[0][0]

        f = base64.b64decode(user.photo_base64)
        mt = magic.from_buffer(f,mime=True)

        bucket_location = s3_client.get_bucket_location(Bucket=bucket)
        s3_client.upload_fileobj(io.BytesIO(f),bucket,key_name, ExtraArgs={'ContentType':mt});
        object_url = ""
        if bucket_location['LocationConstraint'] != None:
            object_url = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
                bucket_location['LocationConstraint'],
                bucket,
                key_name
            )
        else:
            object_url = "https://s3.amazonaws.com/{0}/{1}".format(
                bucket,
                key_name
            )

        cur.execute("""
            INSERT INTO photo
                (id_photo,name,description,link,isProfilePicture,id_user)
            VALUES 
                (DEFAULT,%s,%s,%s,1::bit(1),%s)
            RETURNING id_photo
        """,[key_name,"Foto de perfil",object_url,id_user])

        query_results = cur.fetchall()
        id_photo = query_results[0][0]

        cur.execute("""
            INSERT INTO tag_photo
                (id_photo,id_tag)
            VALUES
                (%s,%s)
        """,[id_photo,id_tag])
        conn.commit()
        conn_pool.putconn(conn)
        return JSONResponse(status_code=201, content={"message": "user created"})
    except Exception as e:
        s3_client.delete_object(Bucket=bucket,Key=key_name)
        conn.rollback()
        conn_pool.putconn(conn)
        print(e)
        raise HTTPException(status_code=500,detail=str(e))

@app.get('/get_user/{username}',status_code=200)
def get_user(username: str) -> classes.User:
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("SELECT id_user,username,name FROM usr WHERE username = %s;",[username])
        query_results = cur.fetchall()
        if len(query_results) == 0 :
            raise Exception("Could not find user in database")
        usr = classes.User(
            id = int(query_results[0][0]),
            username = str(query_results[0][1]),
            name= str(query_results[0][2]),
            profile_picture_url="",
            tags = []
        )
        cur.execute("SELECT link FROM photo WHERE id_user = %s AND isProfilePicture = 1::bit(1)",[usr.id])
        usr.profile_picture_url= str(cur.fetchall()[0][0])
        tags = rekognition_client.detect_faces(
            Image={
                'S3Object': {
                    'Bucket': bucket,
                    'Name': usr.profile_picture_url[-39:]
                }
            },
            Attributes=['AGE_RANGE','BEARD','EYEGLASSES','GENDER','MUSTACHE','SUNGLASSES']
        )

        for tag in tags['FaceDetails'][0]:
            if tag == 'AgeRange':
                usr.tags.append(f"{tags['FaceDetails'][0][tag]['Low']} - {tags['FaceDetails'][0][tag]['High']} años de edad")
            elif tag == 'Beard':
                usr.tags.append(f"{ 'Tiene Barba' if tags['FaceDetails'][0][tag]['Value'] else 'No tiene Barba'}")
            elif tag == 'Eyeglasses':
                usr.tags.append(f"{ 'Usa Lentes' if tags['FaceDetails'][0][tag]['Value'] else 'No Usa Lentes'}")
            elif tag == 'Gender':
                usr.tags.append(f"{ 'Hombre' if tags['FaceDetails'][0][tag]['Value'] == 'Male' else 'Mujer'}")
            elif tag == 'Mustache':
                usr.tags.append(f"{ 'Tiene Bigote' if tags['FaceDetails'][0][tag]['Value'] else 'No Tiene Bigote'}")
            elif tag == 'SunGlasses':
                usr.tags.append(f"{ 'Usa Lentes de Sol' if tags['FaceDetails'][0][tag]['Value'] else 'No Usa Lentes de Sol'}")
        conn_pool.putconn(conn)
        return usr
    except Exception as e:
        conn_pool.putconn(conn)
        raise HTTPException(status_code=500,detail=e.__str__())

@app.post('/upload_photo',status_code=201,responses={201: {"model": classes.Message}})
def upload_photo(photo:classes.PhotoUpload):
    conn = conn_pool.getconn()
    key_name = "Fotos_Publicadas/" + datetime.now().strftime('%Y_%m_%d_%H-%M-%S.%f')
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        f = base64.b64decode(photo.photo_base64)
        mt = magic.from_buffer(f,mime=True)
        bucket_location = s3_client.get_bucket_location(Bucket=bucket)
        s3_client.upload_fileobj(io.BytesIO(f),bucket,key_name, ExtraArgs={'ContentType':mt});
        object_url = ""
        if bucket_location['LocationConstraint'] != None:
            object_url = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
                bucket_location['LocationConstraint'],
                bucket,
                key_name
            )
        else:
            object_url = "https://s3.amazonaws.com/{0}/{1}".format(
                bucket,
                key_name
            )
        tags = rekognition_client.detect_labels(
            Image={
                "S3Object": {
                    "Bucket": bucket,
                    "Name": key_name
                }
            },
            MinConfidence=70
        )
        cur.execute("""
            INSERT INTO 
                photo(id_photo,name,description,link,isProfilePicture,id_user)
            VALUES 
            (DEFAULT,%s,%s,%s,0::bit(1),%s)
            RETURNING id_photo
        """,[photo.photo_name,photo.photo_description,object_url,photo.user_id])
        query_results = cur.fetchall()
        id_photo = query_results[0][0]
        image_tags = []
        for tag in tags['Labels']:
            if tag["Categories"][0]['Name'] != "Animals and Pets":
                continue
            cur.execute("""
            INSERT INTO tag
                (id_tag,name)
            VALUES 
                (DEFAULT,%s) 
            ON CONFLICT(name) DO UPDATE
                SET id_tag = tag.id_tag
            RETURNING id_tag
            """,[tag['Name']])
            image_tags.append(tag['Name'])
            query_results = cur.fetchall()
            id_tag = query_results[0][0]
            cur.execute("INSERT INTO tag_photo(id_photo,id_tag) VALUES (%s,%s)",[id_photo,id_tag])

        #s3_client.delete_object(Bucket=bucket,Key=key_name)
        #cur.execute("")
    except Exception as e:
        s3_client.delete_object(Bucket=bucket,Key=key_name)
        conn_pool.putconn(conn)
        conn.rollback()
        raise HTTPException(status_code=500,detail=e.__str__())
    conn.commit()
    conn_pool.putconn(conn)
    return JSONResponse(status_code=201, content={"message": "photo created"})

@app.get('/get_album_list/{username}',status_code=200)
def get_album_list(username:str) -> classes.AlbumList:
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT DISTINCT
                tag.id_tag,tag.name
            FROM photo
            JOIN tag_photo ON photo.id_photo = tag_photo.id_photo
            JOIN tag ON tag.id_tag = tag_photo.id_tag
            JOIN usr ON photo.id_user = usr.id_user
            WHERE usr.username = %s
        """,[username])
        query_results = cur.fetchall()
        if len(query_results) == 0 :
            raise Exception("Could not find user in database")
        album_list = classes.AlbumList(albums=[])
        for album in query_results:
            album_list.albums.append(classes.Album(album_id=int(album[0]),album_name=str(album[1])))
        conn_pool.putconn(conn)
        return album_list
    except Exception as e:
        conn_pool.putconn(conn)
        raise HTTPException(status_code=500,detail=e.__str__())

@app.get('/get_album_photos/{username}/{id_album}',status_code=200)
def get_album_photos(username:str,id_album:int) -> classes.AlbumPhotos:
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT 
                photo.id_photo,photo.name,photo.description,photo.link
            FROM photo
            JOIN tag_photo ON photo.id_photo = tag_photo.id_photo
            JOIN tag ON tag.id_tag = tag_photo.id_tag
            JOIN usr ON photo.id_user = usr.id_user
            WHERE usr.username = %s AND tag.id_tag = %s
        """,[username,id_album])
        query_results = cur.fetchall()
        photo_list = classes.AlbumPhotos(album_id=id_album,photos=[])
        for photo in query_results:
            photo_list.photos.append(classes.Photo(
                photo_id=int(photo[0]),
                photo_name=str(photo[1]),
                photo_desc=str(photo[2]),
                photo_url=str(photo[3])
            ))
        conn_pool.putconn(conn)
        return photo_list
    except Exception as e:
        conn_pool.putconn(conn)
        raise HTTPException(status_code=500,detail=e.__str__())

@app.get('/photo/{id_photo}',status_code=200)
def get_photo(id_photo:int) -> classes.Photo:
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("SELECT name,description,link FROM photo WHERE id_photo = %s",[id_photo])
        query_results = cur.fetchall()
        if len(query_results) == 0 :
            raise Exception("Could not find photo in database")
        photo = classes.Photo(
            photo_id=id_photo,
            photo_name=str(query_results[0][0]),
            photo_desc=str(query_results[0][1]),
            photo_url=str(query_results[0][2]),
        )
        langs = ['es','fr','it','pt']
        for lang in langs:
            resp = translate_client.translate_text(
                Text = photo.photo_desc,
                SourceLanguageCode = 'auto',
                TargetLanguageCode = lang
            )
            if photo.photo_translations == None:
                photo.photo_translations = []
            photo.photo_translations.append(classes.DescTranslation(lang=lang,text=resp['TranslatedText']))
        conn_pool.putconn(conn)
        return photo
    except Exception as e:
        conn_pool.putconn(conn)
        raise HTTPException(status_code=500,detail=e.__str__())

@app.post('/login', status_code=200)
def login(creds:classes.Login) -> classes.LoginResponse:
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        md5_pass = md5((creds.password).encode('utf-8')).hexdigest()
        cur.execute("SELECT 0 FROM userr WHERE username = %s AND password = %s",[creds.username,md5_pass])
        if len(cur.fetchall()) == 0:
            return classes.LoginResponse(correct=False)
        conn_pool.putconn(conn)
        return classes.LoginResponse(correct=True)
    except Exception as e:
        conn_pool.putconn(conn)
        raise HTTPException(status_code=500,detail=e.__str__())

@app.post('/login_photo', status_code=200)
def login_photo(creds:classes.LoginPhoto) -> classes.LoginResponse:
    conn = conn_pool.getconn()
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT
                photo.link
            FROM
                photo
            JOIN usr ON usr.id_user = photo.id_user
            WHERE usr.username = %s AND photo.isProfilePicture = 1::bit(1)
        """,[creds.username])
        query_results = cur.fetchall()
        if len(query_results) == 0:
            return classes.LoginResponse(correct=False)
        photo_s3 = query_results[0][0][-39:] # los ultimos 39 caracteres son el objeto de s3
        photo_login = base64.b64decode(creds.photo_base64)

        response = rekognition_client.compare_faces(
            SourceImage = {
                "S3Object": {
                    "Bucket": bucket,
                    "Name": photo_s3
                },    
            },
            TargetImage = {
                "Bytes":photo_login
            }
        )
        conn.rollback()
        if len(response['FaceMatches']) == 0 or response['FaceMatches'][0]['Similarity'] < 90:
            return classes.LoginResponse(correct=False)
        return classes.LoginResponse(correct=True)
    except InvalidParameterException as e:
        conn_pool.putconn(conn)
        print(e)
        return classes.LoginResponse(correct=False)
    except Exception as e:
        conn_pool.putconn(conn)
        raise HTTPException(status_code=500,detail=e.__str__())

@app.post('/extract_text',status_code=200)
def extract_text(photo:classes.PhotoText) -> classes.Message:
    try:
        response = rekognition_client.detect_text(
            Image={
                "Bytes": base64.b64decode(photo.photo_base64)
            }
        )
        text = ""
        for word in response['TextDetections']:
            text += word['DetectedText'] + " "
        return classes.Message(message=text)
    except Exception as e:
        raise HTTPException(status_code=500,detail=e.__str__())

@app.post('/update_profile', status_code=200,responses={200: {"model": classes.Message}})
def update_profile(user:classes.UserUpdate):
    conn = conn_pool.getconn()
    key_name = "Fotos_Perfil/" + datetime.now().strftime('%Y_%m_%d_%H-%M-%S.%f')
    if not conn:
        raise HTTPException(status_code=500,detail="can't connect to database")
    try:
        cur = conn.cursor()
        md5_pass = md5((user.password).encode('utf-8')).hexdigest()
        cur.execute("SELECT * FROM usr WHERE id_user = %s AND password = %s",[user.user_id,md5_pass])
        if len(cur.fetchall()) == 0:
            raise Exception("Incorrect Password")
        if user.new_username and user.new_username != "":
            cur.execute("UPDATE usr SET username = %s WHERE id_user = %s",[user.new_username,user.user_id])
        if user.new_name and user.new_name != "":
            cur.execute("UPDATE usr SET name = %s WHERE id_user = %s",[user.new_name,user.user_id])
        if user.new_photo_base64 and user.new_photo_base64 != "":
            cur.execute("""
                SELECT tag.id_tag 
                FROM photo
                JOIN tag_photo ON photo.id_photo = tag_photo.id_photo
                JOIN tag ON tag.id_tag = tag_photo.id_tag
                WHERE photo.isProfilePicture = 1::bit(1)
            """)
            id_tag = cur.fetchone()[0]
            cur.execute("UPDATE photo SET isProfilePicture = 0::bit(1) WHERE isProfilePicture = 1::bit(1) AND id_user= %s", [user.user_id])
            f = base64.b64decode(user.new_photo_base64)
            mt = magic.from_buffer(f,mime=True)
            bucket_location = s3_client.get_bucket_location(Bucket=bucket)
            s3_client.upload_fileobj(io.BytesIO(f),bucket,key_name, ExtraArgs={'ContentType':mt});
            object_url = ""
            if bucket_location['LocationConstraint'] != None:
                object_url = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
                    bucket_location['LocationConstraint'],
                    bucket,
                    key_name
                )
            else:
                object_url = "https://s3.amazonaws.com/{0}/{1}".format(
                    bucket,
                    key_name
                )
            cur.execute("""
                INSERT INTO photo
                    (id_photo,name,description,link,isProfilePicture,id_user)
                VALUES 
                    (DEFAULT,%s,%s,%s,1::bit(1),%s)
                RETURNING id_photo
            """,[key_name,"Foto de perfil",object_url,user.user_id])
            query_results = cur.fetchall()
            id_photo = query_results[0][0]

            cur.execute("""
                INSERT INTO tag_photo
                    (id_photo,id_tag)
                VALUES
                    (%s,%s)
            """,[id_photo,id_tag])
    except Exception as e:
        s3_client.delete_object(Bucket=bucket,Key=key_name)
        conn.rollback()
        conn_pool.putconn(conn)
        raise HTTPException(status_code=500,detail=e.__str__())
    conn.commit()
    conn_pool.putconn(conn)
    return JSONResponse(status_code=201, content={"message": "user updated"})
