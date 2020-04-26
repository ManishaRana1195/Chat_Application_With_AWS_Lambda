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


def send_message_to_chatroom(connection_id, conversations):
    aws_auth = AWSRequestsAuth(aws_access_key=access_key_id, aws_secret_access_key=secret_access_key,
                               aws_region=region,
                               aws_token=session_token, aws_service="execute-api",
                               aws_host=aws_host)
    chat_endpoint = callback_url + connection_id.replace("=", "") + "%3D"  # encode it later
    requests.post(chat_endpoint, auth=aws_auth, data=json.dumps(conversations))

    return response_object('Your message was delivered successfully')


def lambda_handler(event, context):
    unique_connection_id = event['requestContext']['connectionId']
    user_table = dynamo_client.Table("ConnectionDetails")
    conversation_table = dynamo_client.Table("Conversations")

    connection_details = user_table.scan(FilterExpression=Key("id").eq(unique_connection_id))["Items"]
    if connection_details is not None and len(connection_details) == 1:
        chatroom = connection_details[0]["chatroom"]
        conversations = []
        result = conversation_table.scan(FilterExpression=Key("chatroomId").eq(chatroom))
        for conversation in result["Items"]:
            message_object = {"message_time": conversation["message_time"], "message": conversation["message"],
                              "sender": conversation["sender"], "isRejected": False}
            conversations.append(message_object)

        return send_message_to_chatroom(unique_connection_id, conversations)
    else:
        return response_object('Invalid message sender')


def response_object(message):
    return {'statusCode': 200, 'body': json.dumps(message), 'headers': {'status': 'success'}}
