# Chat_Application_With_AWS_Lambda
This repository contains code for our cloud computing project

Websocket API endpoint: wss://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint         
Websocket callback URL:  https://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint/@connections

We have created 7 lambda functions, listed as below:
 1. Connect, Disconnect and Default: For connecting and disconnecting to a websocket endpoint and forwarding unrecognized messages to default endpoint.  
```
  For connect:
  Request should contain the following: 
     :  api_end_point?username=my_name&email_id=my_email_id&chatroom=unicorns 
    
    Response:
    { 
      'statusCode': 200,
      'body': 'Hello you are connected to the chat serve!!',
      'headers': {'status': 'success'}
    }
```
```
  For disconnecting from chat:
  Request should contain the following:
    { 
      "action" :"disconnect", 
      "username" : username,
      "chatroom" : chatroom
    }
    
  Response:
    { 
      'statusCode': 200,
      'body': 'You are disconnected!!',
      'headers': {'status': 'success'}
    }
    
```

2. Send message: For the user to be able to send messages to another user and store the conversations in Dynamo DB.   

```
  For sending message:
  Request should contain the following:
    {
      "action" :"sendMessage", 
      "message" : "hello how are you?",
      "chatroom" : "chatroom_name" 
    }
     
  Response:
    {
        'message_time': 'timestamp',
        'message': 'hello how are you doing',
        'sender': 'Manisha'
    }
```

3. Content Moderation: If a member of the chatroom tries to post any image that contains violent and adulct content, we prvent them from posting that content in the chatroom.

For content moderation, an image needs to be uploaded by posting it on websocket endpoint.
Step 1: pick image from view
Step 2: encode image in base64 
step 3: The request should look like:
  
```
    Request:
      {
        "action": "contentModeration",
        "file" : base64 encoded image
      }
      
      
    Response:
    {
      'message_time': 'timestamp',
      'message': 'This content is not suitable for this chatroom.',
      'sender': 'Manisha'
    }
```

4. 



#For front end
npm install
npm start


   
   


