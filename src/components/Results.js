import React, { useState, useEffect } from 'react';

const Results = ({ answers, questions, onRestart }) => {
  const [score, setScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    setScore(correctAnswers);
  }, [answers, questions]);

  const percentage = Math.round((score / questions.length) * 100);
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return 'EXCELLENT!';
    if (percentage >= 60) return 'GOOD JOB!';
    return 'KEEP TRYING!';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl mx-auto slide-in">
        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl neon-glow text-center">
          <h2 className="text-4xl font-bold neon-text mb-4">QUIZ COMPLETE</h2>
          
          <div className="mb-8">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
              {score}/{questions.length}
            </div>
            <div className={`text-2xl font-bold mb-2 ${getScoreColor()}`}>
              {percentage}%
            </div>
            <div className="text-xl text-cyan-300 mb-6">
              {getScoreMessage()}
            </div>
          </div>

          <div className="mb-8">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-transparent text-cyan-400 font-bold py-2 px-6 rounded-lg border border-cyan-400 hover:neon-glow transition-all duration-300 mb-4"
            >
              {showDetails ? 'HIDE DETAILS' : 'SHOW DETAILS'}
            </button>
            
            {showDetails && (
              <div className="text-left space-y-4 max-h-64 overflow-y-auto">
                {questions.map((question, index) => (
                  <div key={index} className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                    <p className="font-bold text-white mb-2">{question.question}</p>
                    <p className={`mb-1 ${answers[index] === question.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                      Your answer: {answers[index]}
                    </p>
                    {answers[index] !== question.correctAnswer && (
                      <p className="text-green-400">
                        Correct answer: {question.correctAnswer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={onRestart}
              className="w-full bg-transparent text-pink-400 font-bold py-4 px-8 rounded-lg neon-pink hover:text-white transition-all duration-300 text-xl"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;