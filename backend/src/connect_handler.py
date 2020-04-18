import json
import boto3

dynamo_client = boto3.resource('dynamodb')


def lambda_handler(event, context):
    unique_connection_id = event['requestContext']['connectionId']  # generated by websocket API
    try:
        user_name = event['body']['username']
        user_email = event['body']['email_id']
        chatroom = event['body']['chatroom']  # not sure if chat room needs to be saved

        user_table = dynamo_client.Table("ConnectionDetails")
        user_table.put_item(Item={
            'id': unique_connection_id,
            'user_name': user_name,
            'user_email': user_email,
            'chatroom': chatroom})

        return {
            'statusCode': 200,
            'body': json.dumps('Hello you are connected to the chat serve!!'),
            'headers': {'status': 'success'}
        }

    except Exception as e:
        print("Error occurred while connecting {} for connection id {}".format(e, unique_connection_id))
        return {
            'statusCode': 500,
            'body': json.dumps('Internal Server error while connecting')
        }