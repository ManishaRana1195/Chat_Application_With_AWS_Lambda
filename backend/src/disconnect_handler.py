import json
import boto3

dynamo_client = boto3.resource('dynamodb')

def lambda_handler(event, context):
    unique_connection_id = event['requestContext']['connectionId']
    user_table = dynamo_client.Table("ConnectionDetails")
    # user_name = event['body']['username']
    # chatroom = event['body']['chatroom']  # not sure if chat room needs to be saved

    user_table.delete_item(Key={
        'id': unique_connection_id})

    return {
        'statusCode': 200,
        'body': json.dumps('You are disconnected from chat!!    '),
        'headers': {'status': 'success'}
    }
