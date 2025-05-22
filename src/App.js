import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const QUESTIONS = [
  "Ah, a new witch or wizard! Tell me, do you value courage or cleverness more?",
  "Would you rather explore a mysterious forest or an ancient library?",
  "In a duel, would you rely on instinct or planning?",
  "Do you prefer loyalty, ambition, wisdom, or bravery?",
  "Which magical creature do you admire most: phoenix, dragon, unicorn, or basilisk?",
  "If offered one, which would you choose: power, knowledge, friends, or glory?",
  "What kind of magic appeals most to you: charms, potions, transfiguration, or dark arts?",
  "Would you break the rules to do what’s right?",
  "A friend cheats on an exam—what do you do: tell the professor, confront them, ignore it, or help them?",
  "You find a mysterious book in the Restricted Section. Do you open it?",
  "Which quality defines you best: determination, intelligence, patience, or ambition?",
  "You’re lost at night at Hogwarts. Where do you go: the library, common room, forbidden corridor, or owlery?",
  "You’re offered a chance to lead a group. Do you take it with pride, hesitation, refusal, or strategy?",
  "Last one: What do you want to be remembered for — heroism, wisdom, kindness, or greatness?"
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
      const a = answer.toLowerCase();
  
      if (/brave|courage|instinct|hero|phoenix|glory|duel/.test(a)) scores.Gryffindor++;
      if (/clever|library|wise|knowledge|intelligence|strategy|book|transfiguration/.test(a)) scores.Ravenclaw++;
      if (/loyal|patience|friend|kind|help|unicorn|charms|ignore|kindness/.test(a)) scores.Hufflepuff++;
      if (/ambition|power|dark|basilisk|sly|rules|greatness|dragon/.test(a)) scores.Slytherin++;
    }
  
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
