import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import './logout.css'

export default class JSignOut extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
  }

  signOut=()=> {
    Auth.signOut();
  }

  render() {
    return (
    //   <Button light outline sm border="0" >Sign Out</Button>
    <form onSubmit={this.signOut}>
        <input type="submit"  value="Sign Out" id="logout" ></input>
    </form>
      

    )
  }
}