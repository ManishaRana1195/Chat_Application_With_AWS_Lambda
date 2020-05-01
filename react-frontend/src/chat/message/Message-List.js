import React, { Component } from 'react';

import './Message-List.css';
import { Auth } from 'aws-amplify';

class MessageList extends Component {

    constructor(props) {
        super(props)
        this.user = "";

        Auth.currentAuthenticatedUser({
            bypassCache: false
        }).then(user => {
            this.username = user.username;
            console.log(this.username)
            this.setState({ user })
        })
    }
    state = {
        user: null
    }

    createList = () => {
        let contents = []
        console.log("messages", this.props.messages)
        console.log("Current user", this.state.user)
        for (let index = this.props.messages.length - 1; index >= 0; index--) {
            if (this.props.messages[index].sender === this.state.user["username"]) {
                contents.push(<div>
                    <div className="message-row you-message">
                        <div className="message-content">
                            <div className="message-text">
                                
                                {this.props.messages[index].translated_message}
                            </div>
                            <div className="message-time">{this.props.messages[index].message_time}</div>
                        </div>
                    </div>
                </div>);
            } else {
                contents.push(<div>
                    <div className="message-row other-message">
                        <div className="message-content">
                        <img src={require("../../images/icons/user-picture.svg")} alt="UserImage" />
                            <div className="message-text">
                                <span className="user-style">{this.props.messages[index].sender}:</span><br></br>
                                {this.props.messages[index].translated_message}
                            </div>
                            <div className="message-time">{this.props.messages[index].message_time}</div>
                        </div>
                    </div>
                </div>);
            }
        }
        console.log("contents", contents)
        return contents;
    }
    render() {

        return (
            <div id="chat-message-list">
                {this.createList()}
            </div>
        )
    }
}

export default MessageList;