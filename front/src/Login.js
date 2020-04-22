import React, {Component} from 'react';

class Login extends Component {
    login=(e)=>{
        e.preventDefault()
        this.props.setChatroom(e.target.chatroom.value)       
    }
    render(){
  return (
    <div id="login">
        <form onSubmit={this.login}>
            <label>Chatroom</label><br></br>
            <input type="text" id="chatroom"></input><br></br>
            <input type="submit" id="submit" value="Login"></input>
        </form>      
    </div>
  )
    }
}

export default Login;
