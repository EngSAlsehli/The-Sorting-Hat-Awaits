import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const QUESTIONS = [
  "Ah, a new witch or wizard! Tell me, do you value courage or cleverness more?",
  "Would you rather explore a mysterious forest or an ancient library?",
  "In a duel, would you rely on instinct or planning?",
  "Do you prefer loyalty, ambition, wisdom, or bravery?"
];

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start with first Sorting Hat message
    setMessages([{ role: 'assistant', content: "Welcome to Hogwarts! 🎓🪄 It's time for the Sorting Ceremony!" }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedAnswers = [...answers, input.toLowerCase()];
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAnswers(updatedAnswers);
    setIsLoading(true);

    setTimeout(() => {
      if (questionIndex < QUESTIONS.length) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: QUESTIONS[questionIndex] }
        ]);
        setQuestionIndex(prev => prev + 1);
      } else {
        const house = determineHouse(updatedAnswers);
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: `Hmm... I see... Yes... It must be... 🏰 **${house}**!` }
        ]);
      }
      setIsLoading(false);
    }, 1000);
  };

  const determineHouse = (answers) => {
    const scores = {
      Gryffindor: 0,
      Ravenclaw: 0,
      Hufflepuff: 0,
      Slytherin: 0
    };

    for (const answer of answers) {
      if (/brave|courage|instinct/.test(answer)) scores.Gryffindor++;
      if (/wise|intelligence|library|clever|planning/.test(answer)) scores.Ravenclaw++;
      if (/loyal|forest|friend|kind/.test(answer)) scores.Hufflepuff++;
      if (/ambition|power|sly|resourceful/.test(answer)) scores.Slytherin++;
    }

    // Return house with highest score
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  };

  return (
    <div className="app">
      <header className="app-header">
        🧙 The Sorting Hat Awaits...
      </header>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}>
              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="message assistant-message">
              <div className="loading-dots"><span></span><span></span><span></span></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {questionIndex <= QUESTIONS.length && (
          <form className="input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak your truth..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || input.trim() === ''}>
              {isLoading ? 'Thinking...' : 'Respond'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
