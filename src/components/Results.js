import React, { useState, useEffect } from 'react';

const Results = ({ answers, questions, onRestart, score, maxStreak, totalTime, difficulty }) => {
  const [correctCount, setCorrectCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    const correct = answers.filter((ans, index) => 
      ans.answer === questions[index]?.correctAnswer
    ).length;
    setCorrectCount(correct);
    
    // Animate score counting up
    let current = 0;
    const increment = score / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, [answers, questions, score]);

  const percentage = Math.round((correctCount / questions.length) * 100);
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return { text: '🏆 LEGENDARY!', emoji: '👑' };
    if (percentage >= 80) return { text: '🌟 EXCELLENT!', emoji: '🎯' };
    if (percentage >= 70) return { text: '💪 GREAT JOB!', emoji: '🔥' };
    if (percentage >= 60) return { text: '👍 GOOD!', emoji: '✨' };
    if (percentage >= 50) return { text: '📚 KEEP LEARNING!', emoji: '💡' };
    return { text: '💪 TRY AGAIN!', emoji: '🎮' };
  };

  const getGrade = () => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const achievements = [
    { id: 'perfect', name: 'Perfect Score', emoji: '👑', condition: percentage === 100 },
    { id: 'streak', name: 'Streak Master', emoji: '🔥', condition: maxStreak >= 5 },
    { id: 'speed', name: 'Speed Demon', emoji: '⚡', condition: totalTime / questions.length < 10 },
    { id: 'scholar', name: 'Scholar', emoji: '🎓', condition: percentage >= 80 },
    { id: 'consistent', name: 'Consistent', emoji: '🎯', condition: correctCount >= questions.length * 0.7 },
    { id: 'hard', name: 'Hardcore', emoji: '💀', condition: difficulty === 'hard' && percentage >= 70 },
  ].filter(a => a.condition);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto slide-in">
        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-6 md:p-8 rounded-2xl neon-glow text-center">
          <h2 className="text-3xl md:text-4xl font-bold neon-text mb-6">🎮 QUIZ COMPLETE!</h2>
          
          {/* Score Display */}
          <div className="mb-8">
            <div className="text-7xl font-bold mb-4 neon-text">
              {animatedScore}
            </div>
            <div className="text-xl text-cyan-300 mb-2">POINTS</div>
            
            <div className="flex justify-center items-center gap-8 my-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor()}`}>
                  {correctCount}/{questions.length}
                </div>
                <div className="text-gray-400 text-sm">Correct</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor()}`}>
                  {percentage}%
                </div>
                <div className="text-gray-400 text-sm">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400">
                  {getGrade()}
                </div>
                <div className="text-gray-400 text-sm">Grade</div>
              </div>
            </div>

            <div className={`text-2xl font-bold mb-4 ${getScoreColor()}`}>
              {getScoreMessage().emoji} {getScoreMessage().text}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-800 bg-opacity-50 p-4 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">🔥 {maxStreak}</div>
              <div className="text-xs text-gray-400">Max Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">⏱️ {formatTime(totalTime)}</div>
              <div className="text-xs text-gray-400">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">⚡ {Math.floor(totalTime / questions.length)}s</div>
              <div className="text-xs text-gray-400">Avg/Question</div>
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setShowAchievements(!showAchievements)}
                className="text-yellow-400 font-bold mb-2 flex items-center justify-center gap-2 mx-auto hover:text-yellow-300 transition-colors"
              >
                🏆 {achievements.length} Achievement{achievements.length > 1 ? 's' : ''} Unlocked!
              </button>
              {showAchievements && (
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {achievements.map(a => (
                    <div key={a.id} className="bg-yellow-900 bg-opacity-50 border border-yellow-400 px-3 py-2 rounded-lg text-sm">
                      <span className="text-xl mr-1">{a.emoji}</span>
                      <span className="text-yellow-400">{a.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Details Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-transparent text-cyan-400 font-bold py-2 px-6 rounded-lg border border-cyan-400 hover:neon-glow transition-all duration-300"
            >
              {showDetails ? '🔼 HIDE DETAILS' : '🔽 SHOW DETAILS'}
            </button>
            
            {showDetails && (
              <div className="text-left space-y-3 max-h-64 overflow-y-auto mt-4 pr-2">
                {questions.map((question, index) => {
                  const userAnswer = answers[index];
                  const isCorrect = userAnswer?.answer === question.correctAnswer;
                  const wasSkipped = userAnswer?.answer === 'SKIPPED';
                  const timedOut = userAnswer?.timedOut;
                  
                  return (
                    <div key={index} className={`bg-gray-800 bg-opacity-50 p-4 rounded-lg border-l-4 ${isCorrect ? 'border-green-400' : wasSkipped ? 'border-yellow-400' : 'border-red-400'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-white text-sm flex-1">Q{index + 1}. {question.question}</p>
                        <span className="text-xs ml-2">
                          {isCorrect ? '✅' : wasSkipped ? '⏭️' : timedOut ? '⏰' : '❌'}
                        </span>
                      </div>
                      <p className={`text-sm ${isCorrect ? 'text-green-400' : wasSkipped ? 'text-yellow-400' : 'text-red-400'}`}>
                        Your answer: {wasSkipped ? 'Skipped' : timedOut && !userAnswer?.answer ? 'Time Out' : userAnswer?.answer}
                      </p>
                      {!isCorrect && !wasSkipped && (
                        <p className="text-green-400 text-sm">
                          ✓ Correct: {question.correctAnswer}
                        </p>
                      )}
                      {userAnswer?.points > 0 && (
                        <p className="text-cyan-400 text-xs mt-1">+{userAnswer.points} pts</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onRestart}
              className="w-full bg-transparent text-pink-400 font-bold py-4 px-8 rounded-lg neon-pink hover:text-white transition-all duration-300 text-xl"
            >
              🔄 PLAY AGAIN
            </button>
            <button
              onClick={() => {
                const shareText = `🎮 I scored ${score} points (${percentage}%) on Quiz App!\n🔥 Max Streak: ${maxStreak}\n⏱️ Time: ${formatTime(totalTime)}\nCan you beat my score?`;
                if (navigator.share) {
                  navigator.share({ title: 'Quiz App Score', text: shareText });
                } else {
                  navigator.clipboard.writeText(shareText);
                  alert('Score copied to clipboard!');
                }
              }}
              className="w-full bg-transparent text-cyan-400 font-bold py-3 px-8 rounded-lg border border-cyan-400 hover:neon-glow transition-all duration-300"
            >
              📤 SHARE SCORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;