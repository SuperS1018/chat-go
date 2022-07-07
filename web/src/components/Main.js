import React, { useState, useEffect } from 'react';
import { submitMessage, fetchMessages } from "../actions";
import Messages from './Messages';
import MessageInput from './MessageInput';

const Main = () => {
    const [messages, setMessages] = useState([]);

    const getMessageList = () => {
        fetchMessages()
            .then(data => {
                setMessages(data.body ?? [])
            });
    }

    useEffect(() => {
        getMessageList();
        let timeout = setTimeout(getMessageList(), 2000);
        return () => {
            clearTimeout(timeout);
        }
    }, [])

    const handleSubmit = (message, cb) => {
        let username = window.localStorage.getItem('username');
        if(message) {
            submitMessage({ message, username })
                .then(res => {
                    if(res.statusCode === 200) {
                        getMessageList();
                        cb(false);
                    }
                })
                .catch(err => console.log(err));
        }
    };
    return (
        <>
          <main className="col-sm-8 col-sm-offset-4 col-md-10 col-md-offset-2 main">
            <Messages
                messages={messages}
            />
          </main>
          <MessageInput
            handleSubmit={handleSubmit}
          />
        </>
    );
}

export default Main;