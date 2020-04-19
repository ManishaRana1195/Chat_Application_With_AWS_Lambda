import json
from datetime import datetime
import boto3
import requests
import os

from aws_requests_auth.aws_auth import AWSRequestsAuth
from boto3.dynamodb.conditions import Key

dynamo_client = boto3.resource('dynamodb')
access_key_id = os.environ["access_key_id"]
secret_access_key = os.environ["secret_access_key"]
session_token = os.environ["secret_token"]
region = "us-east-1"
aws_host = "wss://amyjijsyk0.execute-api.us-east-1.amazonaws.com/"
callback_url = " https://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint/%40connections/"


def send_message_to_chatroom(user_table, chatroom, message_object):
    connections_to_chatroom = user_table.scan(FilterExpression=Key("chatroom").eq(chatroom))

    aws_auth = AWSRequestsAuth(aws_access_key=access_key_id, aws_secret_access_key=secret_access_key, aws_region=region,
                               aws_token=session_token, aws_service="execute-api",
                               aws_host=aws_host)

    for connection in connections_to_chatroom["Items"]:
        connection_id = connection["id"]

        chat_endpoint = callback_url + connection_id.replace("=", "") + "%3D"  # encode it later
        post_request = requests.post(chat_endpoint, auth=aws_auth, data=str(message_object))
        print(post_request)


def lambda_handler(event, context):
    unique_connection_id = event['requestContext']['connectionId']
    user_table = dynamo_client.Table("ConnectionDetails")
    conversation_table = dynamo_client.Table("Conversations")
    data = json.loads(event['body'])
    chatroom = data['chatroom']
    message = data['message']
    message_timestamp = str(datetime.now().timestamp())

    sender_row = user_table.scan(FilterExpression=Key("id").eq(unique_connection_id))
    if sender_row["Items"] is not None and len(sender_row["Items"]) == 1:
        message_sender_name = sender_row["Items"][0]["user_name"]
        message_object = {"message_time": message_timestamp, "message": message, "sender": message_sender_name}

        conversation_table.put_item(Item={"chatroomId": chatroom, "message_time": message_timestamp, "message": message,
                                          "sender": message_sender_name})

        send_message_to_chatroom(user_table, chatroom, message_object)
    else:
        print("Error, No such user exists with connection id {}".format(unique_connection_id))
        return {"statusCode": 200, "body": "Invalid message sender"}
