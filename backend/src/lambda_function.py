import json
from datetime import datetime
import boto3
import requests
import os

from aws_requests_auth.aws_auth import AWSRequestsAuth
from boto3.dynamodb.conditions import Key

access_key_id = os.environ["access_key_id"]
secret_access_key = os.environ["secret_access_key"]
session_token = os.environ["secret_token"]
region = "us-east-1"
comprehend_client = client = boto3.client('comprehend', aws_access_key_id=access_key_id,
                                          aws_secret_access_key=secret_access_key,
                                          region_name=region, aws_session_token=session_token)
dynamo_client = boto3.resource('dynamodb')
aws_host = "amyjijsyk0.execute-api.us-east-1.amazonaws.com"
callback_url = "https://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint/%40connections/"


def send_message_to_chatroom(user_table, chatroom, message):
    connections_to_chatroom = user_table.scan(FilterExpression=Key("chatroom").eq(chatroom))

    if connections_to_chatroom["Items"] is not None and len(connections_to_chatroom["Items"]) > 0:
        aws_auth = AWSRequestsAuth(aws_access_key=access_key_id, aws_secret_access_key=secret_access_key,
                                   aws_region=region,
                                   aws_token=session_token, aws_service="execute-api",
                                   aws_host=aws_host)

        for connection in connections_to_chatroom["Items"]:
            connection_id = connection["id"]
            chat_endpoint = callback_url + connection_id.replace("=", "") + "%3D"  # encode it later
            requests.post(chat_endpoint, auth=aws_auth, data=json.dumps(message))

    return response_object('Your message was delivered successfully')


def lambda_handler(event, context):
    unique_connection_id = event['requestContext']['connectionId']
    user_table = dynamo_client.Table("ConnectionDetails")
    conversation_table = dynamo_client.Table("Conversations")
    data = json.loads(event['body'])
    chatroom = data['chatroom']
    message = data['message']
    message_string = str(datetime.now().strftime("%b %d %H:%M:%S"))

    sender_row = user_table.scan(FilterExpression=Key("id").eq(unique_connection_id))
    if sender_row["Items"] is not None and len(sender_row["Items"]) == 1:
        message_sender_name = sender_row["Items"][0]["user_name"]

        if perform_sentiment_analysis(message):
            message = {"message_time": message_string, "message": "Please express yourself in positive way",
                       "sender": message_sender_name, "isRejected": True}
            return send_message_to_chatroom(user_table, chatroom, message)

        conversation_table.put_item(Item={"chatroomId": chatroom, "message_time": message_string, "message": message,
                                          "sender": message_sender_name})

        message_object = {"message_time": message_string, "message": message, "sender": message_sender_name,
                          "isRejected": False}

        return send_message_to_chatroom(user_table, chatroom, message_object)
    else:
        return response_object('Invalid message sender')


def response_object(message):
    return {'statusCode': 200, 'body': json.dumps(message), 'headers': {'status': 'success'}}


def perform_sentiment_analysis(message):
    sentiment_response = client.detect_sentiment(Text=message, LanguageCode="en")
    return sentiment_response.get("Sentiment") == "NEGATIVE"
