import React, { useState, useEffect } from 'react';

const Question = ({ question, questionNumber, totalQuestions, onAnswer, timeLeft, maxTime, streak, usedFiftyFifty }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hiddenAnswers, setHiddenAnswers] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Reset hidden answers when question changes
  useEffect(() => {
    setHiddenAnswers([]);
    setSelectedAnswer(null);
  }, [questionNumber]);

  // Apply 50-50 lifeline
  useEffect(() => {
    if (usedFiftyFifty && hiddenAnswers.length === 0 && question) {
      const wrongAnswers = question.answers.filter(a => a !== question.correctAnswer);
      const shuffledWrong = wrongAnswers.sort(() => Math.random() - 0.5);
      setHiddenAnswers([shuffledWrong[0], shuffledWrong[1]]);
    }
  }, [usedFiftyFifty, question, hiddenAnswers.length]);

  const handleAnswerSelect = (answer) => {
    if (!hiddenAnswers.includes(answer)) {
      setSelectedAnswer(answer);
    }
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const correct = selectedAnswer === question.correctAnswer;
      setIsCorrect(correct);
      setShowFeedback(true);
      
      if (correct) {
        setShowConfetti(true);
        // Play success sound effect
        playSound(correct);
      } else {
        playSound(correct);
      }
      
      setTimeout(() => {
        setShowFeedback(false);
        setShowConfetti(false);
        setIsAnimating(true);
        setTimeout(() => {
          onAnswer(selectedAnswer);
          setSelectedAnswer(null);
          setIsAnimating(false);
        }, 300);
      }, 1500);
    }
  };

  const playSound = (correct) => {
    // Web Audio API for sound effects
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (correct) {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      } else {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
      }
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      // Audio not supported
    }
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / maxTime) * 100;
    if (percentage > 60) return '#22c55e'; // Green
    if (percentage > 30) return '#eab308'; // Yellow
    return '#ef4444'; // Red
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
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff0000'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className={`text-center p-8 rounded-2xl ${isCorrect ? 'bg-green-900 correct-animation' : 'bg-red-900 wrong-animation'} border-4 ${isCorrect ? 'border-green-400' : 'border-red-400'}`}>
            <div className="text-6xl mb-4">{isCorrect ? '🎉' : '😔'}</div>
            <h2 className={`text-3xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'} mb-2`}>
              {isCorrect ? (streak > 2 ? `🔥 ${streak} STREAK!` : 'EXCELLENT!') : 'WRONG!'}
            </h2>
            <p className="text-white text-lg">
              {isCorrect ? `+${Math.floor((timeLeft / maxTime) * 50) + 150} points! 🌟` : `Correct: ${question.correctAnswer}`}
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-6 md:p-8 rounded-2xl neon-glow">
        {/* Timer Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-cyan-400 text-sm font-bold">
              QUESTION {questionNumber} OF {totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              <span 
                className="text-2xl font-bold"
                style={{ color: getTimerColor() }}
              >
                ⏱️ {timeLeft}s
              </span>
            </div>
          </div>
          
          {/* Animated Timer Bar */}
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ 
                width: `${(timeLeft / maxTime) * 100}%`,
                backgroundColor: getTimerColor(),
                boxShadow: `0 0 10px ${getTimerColor()}`
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-6">
            {question.emoji && <span className="text-5xl md:text-6xl mr-4">{question.emoji}</span>}
            <h2 className="text-xl md:text-2xl font-bold text-white" dangerouslySetInnerHTML={{ __html: question.question }}></h2>
          </div>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {question.answers.map((answer, index) => {
            const isHidden = hiddenAnswers.includes(answer);
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(answer)}
                disabled={isHidden || showFeedback}
                className={`p-4 text-left rounded-lg border transition-all duration-300 ${
                  isHidden 
                    ? 'bg-gray-800 bg-opacity-30 border-gray-700 text-gray-600 cursor-not-allowed line-through'
                    : selectedAnswer === answer
                      ? `bg-gradient-to-br ${colors.bg} bg-opacity-50 ${colors.border} ${colors.text} shadow-lg transform scale-105`
                      : `bg-gray-800 bg-opacity-50 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 hover:scale-102`
                }`}
                style={{
                  boxShadow: selectedAnswer === answer ? `0 0 20px ${colors.primary}` : 'none'
                }}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> <span dangerouslySetInnerHTML={{ __html: answer }}></span>
              </button>
            );
          })}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleNext}
          disabled={!selectedAnswer || showFeedback}
          className={`w-full py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 ${
            selectedAnswer && !showFeedback
              ? `bg-transparent ${colors.text} ${colors.border} hover:text-white transform hover:scale-105`
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
          style={{
            boxShadow: selectedAnswer && !showFeedback ? `0 0 20px ${colors.primary}` : 'none'
          }}
        >
          {showFeedback ? '⏳ LOADING...' : (questionNumber === totalQuestions ? '🏁 FINISH QUIZ' : '➡️ NEXT QUESTION')}
        </button>
      </div>
    </div>
  );
};

export default Question;