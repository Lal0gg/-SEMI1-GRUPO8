import base64
from datetime import datetime
import io
import boto3
import os
from psycopg2 import pool
import magic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

load_dotenv()
endpoint = os.getenv('ENDPOINT')
db_port = os.getenv("DB_PORT")
db_user = os.getenv('DB_USER')
db_pass = os.getenv('DB_PASS')
db_name = os.getenv('DB_NAME')
region = os.getenv('REGION')
bucket = os.getenv('BUCKET_NAME')
access_key = os.getenv('ACCESS_KEY')
secret_key = os.getenv('SECRET_KEY')

db_client = boto3.client(
    service_name = 'rds',
    region_name = region,
    aws_access_key_id = access_key,
    aws_secret_access_key = secret_key,
)

s3_client = boto3.client(
    service_name = 's3',
    aws_access_key_id = access_key,
    aws_secret_access_key = secret_key,
)

conn_pool = pool.SimpleConnectionPool(1,20, host=endpoint, port=db_port, database=db_name, user=db_user, password=db_pass,sslrootcert="SSLCERTIFICATE")


class UserCreation(BaseModel):
    username: str
    name: str
    password: str
    photo: str

class Photo(BaseModel):
    photo_name: str
    photo_album: int
    user_id: int

class Album(BaseModel):
    album_name: str
    album_id: int
    

app = FastAPI()

@app.post('/signin', status_code=201)
def signin(user:UserCreation):
    conn = conn_pool.getconn()
    if not conn:
        return {"error":"can't connect to database"} 
    try:
        cur = conn.cursor()
        cur.execute("INSERT INTO userr VALUES (DEFAULT,%s, %s, %s);",[user.username,user.name,user.password])

        cur.execute("SELECT id_user FROM userr WHERE username = %s;",[user.username])
        query_results = cur.fetchall()
        id = query_results[0][0]
        cur.execute("INSERT INTO album VALUES (DEFAULT, %s, %s);",["Fotos de Perfil",id])

        
        cur.execute("SELECT id_album FROM album WHERE id_user= %s;",[id])
        query_results = cur.fetchall()
        album_id = query_results[0][0]
        f = base64.b64decode(user.photo)
        mt = magic.from_buffer(f,mime=True)
        bucket_location = s3_client.get_bucket_location(Bucket=bucket)
        key_name = datetime.now().strftime('%Y_%m_%d_%H-%M-%S.%f')
        s3_client.upload_fileobj(io.BytesIO(f),bucket,key_name, ExtraArgs={'ContentType':mt});
        object_url = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
            bucket_location['LocationConstraint'],
            bucket,
            key_name
        )
        cur.execute("INSERT INTO photo VALUES (DEFAULT,%s,%s,%s::bit(1),%s)",[key_name,object_url,1,album_id])
        print(object_url)
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500,detail=e.__str__())
    conn.commit()
    conn_pool.putconn(conn)

    return {"message":"user created"}

@app.get('/get_user/{user_id}')
def get_user(user_id:int):
    pass

@app.get('/get_album_list/{user_id}')
def get_album_list(user_id:int):
    pass

@app.get('/get_albums/{user_id}')
def get_albums(user_id:int):
    pass

@app.post('/upload_photo')
def upload_photo():
    return {}

@app.post('/create_album')
def create_album():
    return {}

@app.post('/delete_album')
def delete_album():
    return {}

@app.post('/edit_album')
def edit_album():
    return {}

@app.post('/update_profile')
def update_profile():
    pass
