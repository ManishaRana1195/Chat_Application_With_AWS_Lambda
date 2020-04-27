# Chat_Application_With_AWS_Lambda
This repository contains code for our cloud computing project

Websocket API endpoint: wss://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint         
Websocket callback URL:  https://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint/@connections

```
  For connect:
  Request should contain the following: 
     :  api_end_point?username=my_name&email_id=my_email_id&chatroom=unicorns 
    
    Response:
    { 'statusCode': 200,
            'body': 'Hello you are connected to the chat serve!!',
            'headers': {'status': 'success'}
   }
```

```
  For sending message:
  Request should contain the following:
    { "action" :"sendMessage", 
     "message" : "hello how are you?",
     "chatroom" : "chatroom_name" }
     
  Response:
    {'message_time': 'timestamp',
     'message': 'hello how are you doing',
     'sender': 'Manisha'}
```

```
  For disconnecting from chat:
  Request should contain the following:
    { "action" :"disconnect", 
    "username" : username,
    "chatroom" : chatroom}
    
  Response:
    { 'statusCode': 200,
      'body': 'You are disconnected!!',
      'headers': {'status': 'success'}
   }
    
```

For content moderation, a image needs to be uploaded by posting it on websocket endpoint.
Step 1: pick image from view
Step 2: encode image in base64 
step 3: The request should look like:
  
    ```
      {
          "action": "contentModeration",
          "file" : base64 encoded image
      }
    ```  





#For front end
npm install
npm start


   
   


