import json
import boto3
import requests
import os

from aws_requests_auth.aws_auth import AWSRequestsAuth
from boto3.dynamodb.conditions import Key

access_key_id = os.environ["access_key_id"]
secret_access_key = os.environ["secret_access_key"]
session_token = os.environ["secret_token"]
region = "us-east-1"

dynamo_client = boto3.resource('dynamodb')
aws_host = "amyjijsyk0.execute-api.us-east-1.amazonaws.com"
callback_url = "https://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint/%40connections/"


def send_message_to_user(connection_id, connections):
    aws_auth = AWSRequestsAuth(aws_access_key=access_key_id, aws_secret_access_key=secret_access_key,
                               aws_region=region,
                               aws_token=session_token, aws_service="execute-api",
                               aws_host=aws_host)
    chat_endpoint = callback_url + connection_id.replace("=", "") + "%3D"  # encode it later
    requests.post(chat_endpoint, auth=aws_auth, data=json.dumps(connections))
    return {'statusCode': 200, 'headers': {'status': 'success'}}


def lambda_handler(event, context):
    unique_connection_id = event['requestContext']['connectionId']
    user_table = dynamo_client.Table("ConnectionDetails")

    # do try raise exception
    row = user_table.scan(FilterExpression=Key("id").eq(unique_connection_id))
    chatroom = row["Items"][0]["chatroom"]
    other_connections = user_table.scan(FilterExpression=Key("chatroom").eq(chatroom))
    current_connection = []
    for connection in other_connections["Items"]:
        user_object = {'user_name': connection['user_name'], 'user_email': connection['user_email']}
        current_connection.append(user_object)

    return send_message_to_user(unique_connection_id, current_connection)
