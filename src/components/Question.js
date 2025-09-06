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

  const getQuestionColors = () => {
    const colors = [
      { primary: '#00ffff', secondary: '#ff00ff', bg: 'from-cyan-900', border: 'border-cyan-400', text: 'text-cyan-400' },
      { primary: '#ff00ff', secondary: '#00ff00', bg: 'from-pink-900', border: 'border-pink-400', text: 'text-pink-400' },
      { primary: '#00ff00', secondary: '#ffff00', bg: 'from-green-900', border: 'border-green-400', text: 'text-green-400' },
      { primary: '#ffff00', secondary: '#ff8000', bg: 'from-yellow-900', border: 'border-yellow-400', text: 'text-yellow-400' },
      { primary: '#ff8000', secondary: '#ff0080', bg: 'from-orange-900', border: 'border-orange-400', text: 'text-orange-400' },
      { primary: '#8000ff', secondary: '#0080ff', bg: 'from-purple-900', border: 'border-purple-400', text: 'text-purple-400' },
      { primary: '#0080ff', secondary: '#80ff00', bg: 'from-blue-900', border: 'border-blue-400', text: 'text-blue-400' },
      { primary: '#ff4080', secondary: '#40ff80', bg: 'from-rose-900', border: 'border-rose-400', text: 'text-rose-400' },
      { primary: '#80ff40', secondary: '#4080ff', bg: 'from-lime-900', border: 'border-lime-400', text: 'text-lime-400' },
      { primary: '#ff8040', secondary: '#8040ff', bg: 'from-amber-900', border: 'border-amber-400', text: 'text-amber-400' }
    ];
    return colors[(questionNumber - 1) % colors.length];
  };

  if (!question) return null;

  const colors = getQuestionColors();

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
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${(questionNumber / totalQuestions) * 100}%`,
                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`
                }}
              ></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-8">{question.question}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer)}
              className={`p-4 text-left rounded-lg border transition-all duration-300 ${
                selectedAnswer === answer
                  ? `bg-gradient-to-br ${colors.bg} bg-opacity-50 ${colors.border} ${colors.text} shadow-lg`
                  : `bg-gray-800 bg-opacity-50 border-gray-600 text-gray-300 hover:${colors.border} hover:${colors.text}`
              }`}
              style={{
                boxShadow: selectedAnswer === answer ? `0 0 20px ${colors.primary}` : 'none'
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <img 
                  src={question.images[index]} 
                  alt={answer}
                  className="w-full h-24 object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/200x150/333/fff?text=${encodeURIComponent(answer)}`;
                  }}
                  loading="eager"
                />
                <div className="text-center">
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {answer}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className={`w-full py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 ${
            selectedAnswer
              ? `bg-transparent ${colors.text} ${colors.border} hover:text-white`
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
          style={{
            boxShadow: selectedAnswer ? `0 0 20px ${colors.primary}` : 'none'
          }}
        >
          {questionNumber === totalQuestions ? 'FINISH QUIZ' : 'NEXT QUESTION'}
        </button>
      </div>
    </div>
  );
};

export default Question;