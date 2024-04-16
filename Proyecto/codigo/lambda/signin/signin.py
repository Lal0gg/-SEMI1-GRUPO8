import base64
import hashlib
import json
import os
import boto3
from botocore.auth import hmac

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
        response = client.sign_up(
            ClientId=os.getenv('COGNITO_CLIENT_ID'),
            SecretHash=calculate_secret_hash(os.getenv('CLIENT_SECRET'), os.getenv('COGNITO_CLIENT_ID') , body['username']),
            Username = body['username'],
            Password = body['password'],
            UserAttributes = [
                {
                'Name': 'email',
                'Value': body['email']
                }
            ]
        )
        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            return {
                'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
                'body': json.dumps(response)
            }
        return {
            'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
            'body': json.dumps("User created successfully")
        }
    except Exception as e:
        return {
            "isBase64Encoded": False,
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            }),
        }
