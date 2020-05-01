import React, { Component } from 'react';
import './Chat-Title.css';
import JSignOut from '../logout/logout';

class ChatTitle extends Component {

    refresh = (e) => {

    }

    render() {
        return (
            <div id="chat-title" >
                <span>{this.props.name}</span>
                <div className="signOut">
                    <JSignOut></JSignOut>
                </div >
                <div>
                    <form onSubmit={this.refresh}>
                        <input type="submit" id="changeroom" value="Change Room" ></input>
                    </form>
                </div>
            </div >
        )
    }
}

export default ChatTitle;