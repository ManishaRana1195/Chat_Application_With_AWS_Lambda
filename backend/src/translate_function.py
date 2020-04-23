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
translate_client = client = boto3.client('translate', aws_access_key_id=access_key_id,
                                         aws_secret_access_key=secret_access_key,
                                         region_name=region, aws_session_token=session_token)

aws_host = "amyjijsyk0.execute-api.us-east-1.amazonaws.com"
callback_url = "https://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint/%40connections/"


def send_message_to_user(connection_id, conversations):
    aws_auth = AWSRequestsAuth(aws_access_key=access_key_id, aws_secret_access_key=secret_access_key,
                               aws_region=region,
                               aws_token=session_token, aws_service="execute-api",
                               aws_host=aws_host)
    chat_endpoint = callback_url + connection_id.replace("=", "") + "%3D"  # encode it later
    post_request = requests.post(chat_endpoint, auth=aws_auth, data=json.dumps(conversations))
    print(str(post_request))
    return {'statusCode': 200, 'headers': {'status': 'success'}}


def lambda_handler(event, context):
    unique_connection_id = event['requestContext']['connectionId']
    user_table = dynamo_client.Table("ConnectionDetails")
    conversation_table = dynamo_client.Table("Conversations")
    data = json.loads(event['body'])
    current_language = data['current_language']  # check in valid list
    target_language = data['target_language']

    # do try raise exception
    row = user_table.scan(FilterExpression=Key("id").eq(unique_connection_id))
    conversations = conversation_table.scan(FilterExpression=Key("chatroomId").eq(row["chatroom"]))
    translated_conversations = []
    if current_language != target_language:
        for conversation in conversations["Items"]:
            response = translate_client.translate_text(Text='string', SourceLanguageCode=current_language,
                                                       TargetLanguageCode=target_language)
            translated_message = response.get('TranslatedText')
            message_object = {"message_time": conversation["message_time"], "message": conversation["message"],
                              "sender": conversation["sender"], "translated_message": translated_message}
            translated_conversations.append(message_object)

    return send_message_to_user(unique_connection_id, conversations)
