import boto3
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
endpoint = os.getenv('ENDPOINT')
db_port = os.getenv("DB_PORT")
db_user = os.getenv('DB_USER')
db_pass = os.getenv('DB_PASS')
db_name = os.getenv('DB_NAME')
region = os.getenv('REGION')

client = boto3.client(
    service_name = 'rds',
    region_name = region,
    aws_access_key_id = os.getenv('ACCESS_KEY'),
    aws_secret_access_key = os.getenv('SECRET_KEY'),
)

token = client.generate_db_auth_token(DBHostname=endpoint, Port=db_port, DBUsername=db_user, Region=region)

try:
    conn = psycopg2.connect(host=endpoint, port=db_port, database=db_name, user=db_user, password=db_pass,sslrootcert="SSLCERTIFICATE")
    cur = conn.cursor()
    cur.execute("""SELECT now()""")
    query_results = cur.fetchall()
    print(query_results)
except Exception as e:
    print("Database connection failed due to {}".format(e))                
           
