import React, { Component } from 'react';
import './chat-room.css';

class ChatRoom extends Component {

    login = (e) => {
        e.preventDefault()
        this.props.setChatroom(e.target.chatroom.value, e.target.target_language.value);
        //this.props.setTargetLanguage(e.target.target_language.value);
    }
    render() {
        return (
            <div>
                <div id="login">
                    <div>
                        <form onSubmit={this.login} id="loginform">
                            <label id="login label">Chatroom</label><br></br>
                            <input type="text" id="chatroom"></input><br></br>
                            <label id="login label">Targeted Language</label><br></br>
                            <input type="text" id="target_language"></input>
                            <input type="submit" id="submit" value="Enter"></input>
                        </form>
                    </div>

                </div>
            </div>
        )
    }
}

export default ChatRoom;