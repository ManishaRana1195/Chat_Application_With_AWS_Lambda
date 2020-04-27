import React, {Component} from 'react';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import aws_exports from "./config";
import './App.css';
import Login from './Login';
import MessagingPanel from './MessagingPanel';

Amplify.configure(aws_exports);



class App extends Component {
  state={
    chatroom: null
    
  }

  setChatroom=(chatroom)=>{
    console.log(chatroom)
    this.setState({chatroom})
  }
  render(){
  return (
    <div className="App">
      
      {
        !this.state.chatroom ?
          <Login setChatroom={this.setChatroom}></Login>
          :
          <MessagingPanel chatroom={this.state.chatroom}></MessagingPanel>
      }
      
      
    </div>
  )
  }
}

export default withAuthenticator (App,{ includeGreetings:true},false);
