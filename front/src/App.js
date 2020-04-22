import React, {Component} from 'react';
import './App.css';
import Login from './Login';
import MessagingPanel from './MessagingPanel';

class App extends Component {
  state={
    username: null
  }

  setUsername=(username)=>{
    //console.log(username)
    this.setState({username})
  }
  render(){
  return (
    <div className="App">
      {
        !this.state.username ?
          <Login setUsername={this.setUsername}></Login>
          :
          <MessagingPanel username={this.state.username}></MessagingPanel>
      }
      
      
    </div>
  )
  }
}

export default App;
