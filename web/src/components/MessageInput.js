import React, { useState } from 'react';
import '../stylesheets/MessageInput.css';

const MessageInput = ({ handleSubmit }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (e) => {
      if (e.key === 'Enter' && message) {
          setLoading(true);
          handleSubmit(message, setLoading);
          setMessage('');
      }
  }

  const handleChange = (e) => {
      setMessage(e.target.value)
  }

  return (
    <div className="col-sm-8 col-sm-offset-4 col-md-10 col-md-offset-2 input-wrap">
        <div className="form-group one-line">
          <input
            type="text"
            className="form-control"
            onKeyPress={handleKeyPress}
            placeholder="message..."
            onChange={handleChange}
            value={message}
            disabled={loading}
          />
        </div>
    </div>
  )
}

export default MessageInput;