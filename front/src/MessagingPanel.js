import React, { Component, Fragment } from 'react';
import Sockette from 'sockette';
import DisplayConversation from './DisplayConversation';
import MessagingBox from './MessagingBox';

class MessagingPanel extends Component {

  constructor(props) {
    super(props);
    this.ws = new Sockette('wss://amyjijsyk0.execute-api.us-east-1.amazonaws.com/ChatApplicationEndpoint?username=Manisha&email_id=m@gmail.com&chatroom=unicorns', {

      timeout: 5e3,
      maxAttempts: 10,
      onopen: e => console.log('Connected!', e),
      onmessage: e => {
        console.log('Received!!!!', e)
        this.setState({messages:[...this.state.messages, e]})
        console.log(this.state.messages)
      },
      onreconnect: e => console.log('Reconnecting...', e),
      onmaximum: e => console.log('Stop Attempting!', e),
      onclose: e => console.log('Closed!', e),
      onerror: e => console.log('Error:', e)
    });
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
      action : "sendMessage",
      message : message,
      chatroom : "unicorns"
    });
    console.log(this.props.username, message)
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
