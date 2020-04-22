import React, { useEffect, useState } from "react";
import { Launcher } from "react-chat-window";
import Sockette from "sockette";
let ws = null;
var date = new Date();
var timestamp = date.getTime();

const ChatWindow = props => {
  const [messageList, setMessageList] = useState([]);
  const [badge, setBadge] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { username } = props.authData; 
  const  emails  = props.authData.attributes.email;

  useEffect(
    () => {
      console.log("got here")
      if (props.authData)
        ws = new Sockette(
          "wss://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint?username="+username+"&email_id="+emails+"&chatroom=unicorns",
          {
            timeout: 5e3,
            maxAttempts: 1,
            onopen: e => console.log("connected:", e),
            onmessage: e => onMessageReceied(e),
            onreconnect: e => console.log("Reconnecting...", e),
            onmaximum: e => console.log("Stop Attempting!", e),
            onclose: e => console.log("Closed!", e),
            onerror: e => console.log("Error:", e)
          }
        );

      return function cleanup() {
        ws && ws.close();
        ws = null;
      };
    },
    [messageList]
  );


  const handleClick = () => {
    setIsOpen(!isOpen);
    setBadge(0);
  };

  const onMessageWasSent = message => {
    const newMessage = { ...message, author: username };
    ws.send({
      "action" : "blah",
      "message" : newMessage.data.text,
      "chatroom" : "unicorns"
    });
     
  };

  const onMessageReceied = ({ data }) => {
  	console.log("received-",data)
    const { sender, timestamp, data: messageData } = JSON.parse(data);
    const isMe = username === sender ? "me" : "them";
    if (!isOpen) {
      setBadge(+badge + 1);
    }
    setMessageList([
      ...messageList,
      {
        timestamp,
        data: messageData,
	sender: isMe
      }
    ]);
  };
  return (
    <div>
      <Launcher
        agentProfile={{
          teamName: "react-live-chat",
          imageUrl:
            "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png"
        }}
        onMessageWasSent={onMessageWasSent}

        messageList={messageList}
        handleClick={handleClick}
        isOpen={isOpen}
        showEmoji
        newMessagesCount={badge}
      />
    </div>
  );
};

export default ChatWindow;
