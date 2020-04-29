import React, { Component } from 'react';
import { withAuthenticator} from '@aws-amplify/ui-react';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import './App.css';
import ChatShell from './chat/shell/Chat-Shell';
import ChatRoom from './chat/chat-room/chat-room';

Amplify.configure(awsconfig);

class App extends Component {
  state = {
    chatroom: null,
    target_language: "en"
  }

  setChatroom = (chatroom,target_language) => {
    console.log(chatroom,target_language)
    this.setState({ chatroom })
    this.setState({target_language})
  }

  // setTargetLanguage=(target_language)=>{
  //   console.log(target_language)
  // }
  render() {

    return (
      <div className="App">
        {
          !this.state.chatroom ?
            <ChatRoom setChatroom={this.setChatroom}></ChatRoom>
            :
            <ChatShell chatroom={this.state} />
        }
      </div>
    )
  }
}

export default withAuthenticator(App);
