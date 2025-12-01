import React, { useState } from 'react';
import '../styles/ChatBox.css';

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { user: 'User123', text: 'This is awesome!' },
    { user: 'StreamerFan', text: 'Let’s gooo!' },
    { user: 'TechGuru', text: 'What framework is this?' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { user: 'You', text: input }]);
    setInput('');
  };

  return (
    <div className="chatbox">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.user}:</strong> {m.text}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}


