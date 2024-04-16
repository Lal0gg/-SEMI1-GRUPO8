import base64
import hashlib
import os
import boto3
from botocore.auth import hmac
import json

client = boto3.client(service_name='cognito-idp',region_name='us-east-2')

def calculate_secret_hash(client_secret, client_id, username):
    key = bytes(client_secret, 'utf-8')
    message = bytes(f"{username}{client_id}", 'utf-8')
    return base64.b64encode(hmac.new(key, message, digestmod=hashlib.sha256).digest()).decode()

def lambda_handler(event, context):
    try:
        body = {}
        if event.get('body'):
            body = json.loads(event['body'])
        else:
            body = event
        response = client.initiate_auth(
            ClientId=os.getenv('COGNITO_CLIENT_ID'),
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': body['username'],
                'PASSWORD': body['password'],
                'SECRET_HASH': calculate_secret_hash(os.getenv('CLIENT_SECRET'), os.getenv('COGNITO_CLIENT_ID') , body['username'])
            },
        )
        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            return {
                'isBase64Encoded': False,
                'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
                'body': json.dumps(response),
            }
        return {
            'isBase64Encoded': False,
            'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
            'body': json.dumps(response['AuthenticationResult'])
    }
    except Exception as e:
        return {
            "isBase64Encoded": False,
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            }),
        }
