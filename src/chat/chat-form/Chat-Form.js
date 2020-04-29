import React, { Component } from 'react';

import './Chat-Form.css';

class ChatForm extends Component {

    messageHandler = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            this.props.getMessage(e.target.value)
            console.log(e.target.value)
            e.target.value = ""

        }
    }

    render() {
        return (
            <div id="chat-form" >
                {/* <img src={require("../../images/icons/attachment-logo.svg")} alt="Add Attachment" /> */}
                <input type="text" placeholder="Type something to send... " onKeyDown={this.messageHandler} />
            </div>
        )
    }
}

export default ChatForm;