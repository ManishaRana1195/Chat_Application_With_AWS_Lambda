import React, { Component, Fragment } from 'react';
import Sockette from 'sockette';
import DisplayConversation from './DisplayConversation';
import MessagingBox from './MessagingBox';
import { Auth } from 'aws-amplify';

// const email=props.authData.attributes.email;
// const {username}=props.authData;

class MessagingPanel extends Component {


  constructor(props) {
    super(props)
    //console.log(props.authData)
    this.username = "";
    this.email = "";

    Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.username = user.username;
      this.email = user.attributes.email;
      this.chatroom=props.chatroom
      console.log(this.username, this.email, this.chatroom)
      this.ws = new Sockette("wss://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint?username="+this.username+"&email_id="+this.email+"&chatroom="+this.chatroom,{

        timeout: 5e3,
        maxAttempts: 10,
        onopen: e => console.log('Connected!', e),
        onmessage: e => {
          console.log('Received!!!!', e)
          console.log(e.data)
          //this.setState({messages:[...this.state.messages, e]})
          //console.log(this.state.messages)
          var str = e.data
          var json = JSON.parse(str.replace(/'/g, '"'))
          console.log(json["message"])
          this.setState({ messages: [...this.state.messages, json] })
        },
        onreconnect: e => console.log('Reconnecting...', e),
        onmaximum: e => console.log('Stop Attempting!', e),
        onclose: e => console.log('Closed!', e),
        onerror: e => console.log('Error:', e)
      });
    })
      .catch(err => console.log(err));
  }



  state = {
    messages: []
  }

  getMessage = (message) => {
    let data = {
      "action": "sendMessage",
      "message": message,
      "chatroom": "unicorns"
    };

    this.ws.json({
      action: "sendMessage",
      message: message,
      chatroom: "unicorns"
    });
    console.log(this.props.chatroom, message)
  }

  render() {
    return (
      <Fragment>
        <DisplayConversation messages={this.state.messages}></DisplayConversation>
        <MessagingBox getMessage={this.getMessage}></MessagingBox>
      </Fragment>
    )
  }
}

export default MessagingPanel;
