# Chat_Application_With_AWS_Lambda
This repository contains code for our cloud computing project

Websocket API endpoint: wss://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint         
Websocket callback URL:  https://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint/@connections

```
  For connect:
  Request should contain the following:
    { "action" :"connect", 
    "username" : username,
    "email_id" : email_id,
    "chatroom" : chatroom}
    
    Response:
    { 'statusCode': 200,
            'body': 'Hello you are connected to the chat serve!!',
            'headers': {'status': 'success'}
   }
```

```
  For sending message:
  Request should contain the following:
    
  Response:
    
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



#For front end
npm install
npm start


   
   


