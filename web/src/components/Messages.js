import React, { useRef, useEffect } from 'react';
import Emojify from 'react-emojione';

import '../stylesheets/Messages.css';

const Messages = ({ messages }) => {
  const HEADER_HEIGHT = 59;
  const MESSAGE_INPUT_HEIGHT = 75;
  const ulElement = useRef(null);
  const username = window.localStorage.getItem('username');

  useEffect(() => {
    ulElement.current.scrollTop = ulElement.current.scrollHeight;
  }, [messages])


  const handleTimeFormat = (t) => {
    let time = new Date(t / 1000000);
    let h = time.getHours();
    let ap = (h >= 12)? 'pm' : 'am';
    let m = time.getMinutes();
    h = h % 12;
    h = h ? h : 12;
    m = m < 10 ? '0' + m : m;
    return h + ":" + m + ap;
  };



    return (
        <ul className="messages-wrap"
            ref={ ulElement }
            style={{ height: (window.innerHeight - HEADER_HEIGHT - MESSAGE_INPUT_HEIGHT) }}
        >
          { messages.length ? messages.map((i, index) => {
            return (
                <li className={ `message ${ (i.Username === username )?'me':null }` } key={ index }>
                  { (i.Username !== username) && <div className="init hidden-xs"><span className="text box-text">{ i.Username[0] }</span></div> }
                  <div className="info">
                    <span className="text f14 text-semi">{ (i.Username === username)?'me' : i.Username }</span>
                    { i.Timestamp && <span className="text f14 text-light">{ handleTimeFormat(i.Timestamp) }</span> }<br/>
                    <span className="message-box"><Emojify style={{ height: '15px', width: '15px' }}>{ i.Message }</Emojify></span>

                    {/*{ (i.Username === username || i.active) && <span className="glyphicon glyphicon-remove-circle pull-right text f20 text-gray del-btn" onClick={ () => this.handleDelete(i) }></span> }*/}
                  </div>
                </li>
            )
          }) : <li className="message">No message yet...</li> }
        </ul>
    );
}

export default Messages;
