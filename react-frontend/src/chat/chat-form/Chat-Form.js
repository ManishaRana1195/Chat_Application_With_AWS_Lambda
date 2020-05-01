import React, { Component } from "react";
import { ImagePicker } from "react-file-picker";

import "./Chat-Form.css";

class ChatForm extends Component {
  messageHandler = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.getMessage(e.target.value);
      console.log(e.target.value);
      e.target.value = "";
    }
  };

  render() {
    return (
      <div id="chat-form">
        <ImagePicker
          extensions={["jpg", "jpeg", "png"]}
          dims={{ minWidth: 100, maxWidth: 1000, minHeight: 100, maxHeight: 1000 }}
          onChange={base64 => { this.props.uploadImage(base64); }}
          onError={errMsg => console.log(errMsg)}
        >
          <button>
            <img src={require("../../images/icons/attachment-logo.svg")} alt="Add Attachment"/>
          </button>
        </ImagePicker>

        <input
          type="text"
          placeholder="Type something to send... "
          onKeyDown={this.messageHandler}
        />
      </div>
    );
  }
}

export default ChatForm;
