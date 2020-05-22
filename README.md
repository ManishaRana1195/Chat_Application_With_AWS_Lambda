# Chat_Application_With_AWS_Lambda
This repository contains code for our cloud computing project

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
 Step 3: The request should look like:
  
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

4. Translation function: The functionality of translating the chat messages from one current language to a target language.

```
   Request:
    {
       "action" : "translateMessage",
       "current_language" : "en",
       "target_language" : "fr",
       "conversation" : [
        {
          'message_time': 'timestamp',
          'message': 'hello how are you doing',
          'sender': 'Manisha'
        }
       ]
    }
    
    Response:
    {[
      'message_time': 'timestamp',
      'message': 'hello how are you doing',
      'translated_message' : "qu est qu tu fais",
      'sender': 'Manisha'
    ]}
```
   
5. Current users: A function to provide list of connected users to the chatroom.
6. Previous Messages: A function to load previous messages 

## Screenshot of final version of our application
![](https://github.com/ManishaRana1195/Chat_Application_With_AWS_Lambda/blob/master/docs/Screenshot%20from%202020-04-29%2020-28-45.png)


#For front end
npm install
npm start


   
   


