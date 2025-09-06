import React, { useState } from 'react';

const Question = ({ question, questionNumber, totalQuestions, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      setIsAnimating(true);
      setTimeout(() => {
        onAnswer(selectedAnswer);
        setSelectedAnswer(null);
        setIsAnimating(false);
      }, 300);
    }
  };

  if (!question) return null;

  return (
    <div className={`w-full max-w-2xl mx-auto slide-in ${isAnimating ? 'opacity-50' : ''}`}>
      <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl neon-glow">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-cyan-400 text-sm font-bold">
              QUESTION {questionNumber} OF {totalQuestions}
            </span>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-500"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-8">{question.question}</h2>
        </div>

        <div className="space-y-4 mb-8">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer)}
              className={`w-full p-4 text-left rounded-lg border transition-all duration-300 ${
                selectedAnswer === answer
                  ? 'bg-cyan-900 bg-opacity-50 neon-glow text-cyan-100'
                  : 'bg-gray-800 bg-opacity-50 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-300'
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {answer}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className={`w-full py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 ${
            selectedAnswer
              ? 'bg-transparent text-pink-400 neon-pink hover:text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {questionNumber === totalQuestions ? 'FINISH QUIZ' : 'NEXT QUESTION'}
        </button>
      </div>
    </div>
  );
};

export default Question;