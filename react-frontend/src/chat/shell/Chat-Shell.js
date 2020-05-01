import React, { Component } from "react";
import Sockette from "sockette";
import { Auth } from "aws-amplify";

import ChatSearch from "../search/Chat-Search";
import ConversationList from "../conversation/Conversation-List";
import ChatTitle from "../chat-title/Chat-Title";
import MessageList from "../message/Message-List";
import ChatForm from "../chat-form/Chat-Form";

import "./Chat-Shell.css";

class ChatShell extends Component {
  constructor(props) {
    super(props);
    this.username = "";
    this.email = "";
    this.translatejson = "";

    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => {
        this.username = user.username;
        this.email = user.attributes.email;
        this.chatroom = props.chatroom;
        //this.target_language=props.target_language
        console.log(this.chatroom.chatroom);
        this.ws = new Sockette(
          "wss://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint?username=" +
            this.username +
            "&email_id=" +
            this.email +
            "&chatroom=" +
            this.chatroom.chatroom,
          {
            timeout: 5e3,
            maxAttempts: 10,
            onopen: e => {
              // var j=this.getUsers()
              // console.log("ysers", j)
              console.log("Connected!", e);
              var str = e.data;
              console.log("dsdsas", str);
            },
            onmessage: e => {
              console.log("Received!!!!", e);
              console.log("e,data", e.data);
              //this.setState({messages:[...this.state.messages, e]})
              //console.log(this.state.messages)
              //var str = e.data
              var newstr = e.data;
              //newstr.replace('[','');
              //newstr.replace(']','');
              //JSON.parse(newstr.replace('}]','}'))
              var translatejson = JSON.parse(newstr.replace(/'/g, '"'));
              console.log("parse1", translatejson);
              if ("isRejected" in translatejson === true) {
                console.log("inside if");
              }
              delete translatejson.isRejected;
              console.log("newstr.isRejected", translatejson.isRejected);
              console.log("translate json", translatejson);
              this.translatejson = translatejson;

              if ("translated_message" in translatejson === false) {
                //var json = JSON.parse(str.replace(/'/g, '"'))
                console.log("inside translate logic");

                // this.ws.json({
                //     action: "translateMessage",
                //     current_language: "en",
                //     target_language: "fr",
                //     conversations: translatejson
                // })

                this.translateMessages(translatejson);
              } else {
                console.log(
                  "message in json",
                  translatejson["translated_message"]
                );

                this.setState({
                  messages: [...this.state.messages, translatejson]
                });
                this.state.messages.map(message =>
                  console.log("next messgae", message.translated_message)
                );
              }

              // var json = JSON.parse(str.replace(/'/g, '"'))
              // console.log("message in json", json["message"])

              // this.setState({ messages: [...this.state.messages, json] })
              // this.state.messages.map(message =>
              //     console.log("next messgae", message.message)
              // )
            },
            onreconnect: e => console.log("Reconnecting...", e),
            onmaximum: e => console.log("Stop Attempting!", e),
            onclose: e => console.log("Closed!", e),
            onerror: e => console.log("Error:", e)
          }
        );
      })
      .catch(err => console.log(err));
  }

  state = {
    messages: [],
    currentUsers: []
  };

  getMessage = message => {
    this.ws.json({
      action: "sendMessage",
      message: message,
      chatroom: this.props.chatroom.chatroom
    });
    // this.ws.json({
    //     action: "translateMessage",
    //     current_language:"en",
    //     target_language:"fr"
    // })
  };

  translateMessages = translatejson => {
    console.log("calling translate", translatejson);
    console.log("printing target lang", this.props.chatroom.target_language);
    this.ws.json({
      action: "translateMessage",
      current_language: "en",
      target_language: this.props.chatroom.target_language,
      conversation: translatejson
    });
  };

  // getUsers = () => {
  //     this.ws.json({
  //         action: "GetCurrentUsers"
  //     });
  // }

  uploadImage = fileData => {
    console.log("uploading image");

    let data = {
      action: "contentModeration",
      data: fileData
    };

    this.ws.json(data);
  };

  render() {
    return (
      <div id="chat-container">
        {/* {this.getUsers()} */}
        <ChatSearch />
        <ConversationList />
        <ChatTitle name={this.props.chatroom.chatroom} />
        <MessageList messages={this.state.messages} />
        <ChatForm getMessage={this.getMessage} uploadImage={this.uploadImage} />
      </div>
    );
  }
}

export default ChatShell;
