import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const webhookUrl = 'https://hook.eu2.make.com/8y22wz2jcjkr29xy595xyi4r98h94asd';

  const sendMessage = () => {
    const text = messageText.trim();
    if (!text) return;

    setMessages(prev => [...prev, { text, sender: 'user' }]);
    setMessageText('');

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then(res => res.json())
      .then(data => {
        const botReply = data.response || 'Lo siento, no puedo responder en este momento.';
        setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
      })
      .catch(() => {
        setMessages(prev => [...prev, { text: 'Error en la respuesta del chatbot.', sender: 'bot' }]);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-app-container">
      <div className="chat-app-header">Alexbot</div>
      <div className="chat-app-message-display">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-app-message ${
              msg.sender === 'user' ? 'chat-app-user-message' : 'chat-app-bot-message'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-app-input-container">
        <textarea
          className="chat-app-message-input"
          placeholder="Escribe un mensaje..."
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="chat-app-send-button" onClick={sendMessage}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

export default App;