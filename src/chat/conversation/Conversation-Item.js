import React from 'react';

import './Conversation-Item.css';

const ConversationItem=(props)=> {
    return (
        <div className="conversation">
            <div className="title-text">{props.conversation.title}</div>
        </div>
    );
}

export default ConversationItem;