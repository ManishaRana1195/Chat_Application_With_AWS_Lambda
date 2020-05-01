import React, { Component } from 'react';
import './chat-room.css';
import JSignOut from '../logout/logout';

class ChatRoom extends Component {

    login = (e) => {
        e.preventDefault()
        this.props.setChatroom(e.target.chatroom.value, e.target.target_language.value);
    }
    render() {
        return (
            <div>
                <div id="login">
                    <div>
                        <form onSubmit={this.login} id="loginform">
                            <label id="login label">Chatroom</label><br></br>
                            <input type="text" id="chatroom" list="chatroom_list"></input><br></br>
                            <datalist id="chatroom_list">
                                <option value='Chatroom 1' />
                                <option value='Chatroom 2' />
                                <option value='Chatroom 3' />
                            </datalist>
                            <label id="login label">Targeted Language</label><br></br>
                            <input type="text" id="target_language" list="language_list"></input>
                            <datalist id="language_list">
                                <option value='en' />
                                <option value='fr' />
                                <option value='de' />
                                <option value='es' />
                                <option value='it' />
                            </datalist>
                            <input type="submit" id="submit" value="Enter"></input>
                            <JSignOut></JSignOut>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatRoom;