import base64
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
dynamo_client = boto3.resource('dynamodb')
aws_host = "amyjijsyk0.execute-api.us-east-1.amazonaws.com"
callback_url = "https://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint/%40connections/"

client = boto3.client('rekognition', region_name='us-east-1')

s3_client = boto3.client("s3", region_name='us-east-1')

aws_auth = AWSRequestsAuth(aws_access_key=access_key_id, aws_secret_access_key=secret_access_key,
                           aws_region=region,
                           aws_token=session_token, aws_service="execute-api",
                           aws_host=aws_host)


# post the image back to callback url
def send_error_message_to_user(connections, message):
    if connections is not None and len(connections) > 0:

        for connection in connections:
            connection_id = connection.get("id")
            chat_endpoint = callback_url + connection_id.replace("=", "") + "%3D"  # encode it later
            requests.post(chat_endpoint, auth=aws_auth, data=json.dumps(message))

    return response_object('Your message was delivered successfully')


def post_image_to_chatroom(connections, file_data):
    files = {"file": ('filename', file_data, 'multipart/form-data')}

    if connections is not None and len(connections) > 0:
        for connection in connections:
            connection_id = connection["id"]
            chat_endpoint = callback_url + connection_id.replace("=", "") + "%3D"  # encode it later
            requests.post(chat_endpoint, auth=aws_auth,
                          files=files)

    return response_object('Your message was delivered successfully')


def lambda_handler(event, context):
    unique_connection_id = event['requestContext']['connectionId']
    body = json.loads(event['body'])
    image_file = body['data']
    image_text = image_file[image_file.find(",") + 1:]
    decoded_image = base64.b64decode(image_text + "===")
    message_time = str(datetime.now().strftime("%b %d %H:%M:%S"))
    possible_labels = ["Explicit Nudity", "Suggestive", "Violence", "Visually Disturbing"]
    user_table = dynamo_client.Table("ConnectionDetails")

    row = user_table.scan(FilterExpression=Key("id").eq(unique_connection_id))["Items"]
    chatroom = row[0]["chatroom"]

    response = client.detect_moderation_labels(Image={'Bytes': decoded_image}, MinConfidence=70)

    needs_content_moderation = False
    for label in response['ModerationLabels']:
        if label['Confidence'] > 95.0 and label['ParentName'] in possible_labels:
            needs_content_moderation = True

    if needs_content_moderation:
        message_object = {"message_time": message_time, "message": "This content is not suitable for this chatroom",
                          "sender": row[0]['user_name'],
                          "isRejected": True}
        return send_error_message_to_user(row, message_object)

    else:
        connections = user_table.scan(FilterExpression=Key("chatroom").eq(chatroom))
        return post_image_to_chatroom(connections['Items'], image_text)


def response_object(message):
    return {'statusCode': 200, 'body': json.dumps(message), 'headers': {'status': 'success'}}
