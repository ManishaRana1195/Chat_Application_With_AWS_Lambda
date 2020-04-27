import React, {Component} from 'react';

class MessagingBox extends Component {

    messageHandler=(e)=>{
        if (e.keyCode===13){
            e.preventDefault()
            this.props.getMessage(e.target.value)
            console.log(e.target.value)
            e.target.value=""
            
        }
    }

    render(){
  return (
    <div id="messagingPanel">
      <textarea onKeyDown={this.messageHandler}></textarea>
    </div>
  )
    }
}

export default MessagingBox;
