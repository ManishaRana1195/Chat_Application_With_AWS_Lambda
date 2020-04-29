import React, { Component } from 'react';
import Sockette from 'sockette';


import ConversationItem from './Conversation-Item';
import './Conversation-List.css';



class ConversationList extends Component {

    

    render() {
        return (
            <div id="conversation-list">
                <ConversationItem conversation={{ title: 'Username1' }}></ConversationItem>
            </div>
        )
    }
}

export default ConversationList;