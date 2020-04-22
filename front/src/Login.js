import React, {Component} from 'react';

class Login extends Component {
    login=(e)=>{
        e.preventDefault()
        this.props.setUsername(e.target.username.value)       
    }
    render(){
  return (
    <div id="login">
        <form onSubmit={this.login}>
            <label>Username</label><br></br>
            <input type="text" id="username"></input><br></br>
            <input type="submit" id="submit" value="Login"></input>
        </form>      
    </div>
  )
    }
}

export default Login;
