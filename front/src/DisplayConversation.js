import React, { Component } from 'react';

class DisplayConversation extends Component {

  render() {
    return (
      <div id="displayConversation">
        {
          this.props.messages.map(message => <div>{message.sender}:{message.message}</div>)
          //this.displayMessage()
        }
      </div>
    )
  }
}

export default DisplayConversation;
