import React from 'react';
import { QuizProvider } from './QuizContext';
import Quiz from './components/Quiz';
import './App.css';

function App() {
  return (
    <QuizProvider>
      <div className="min-h-screen relative">
        <div className="bubble-bg">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>
        <div className="relative z-10">
          <Quiz />
        </div>
      </div>
    </QuizProvider>
  );
}

export default App;