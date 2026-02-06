import React, { useState, useEffect, useCallback } from 'react';
import Question from './Question';
import Results from './Results';
import { commonQuestions } from '../data/questions';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [gameMode, setGameMode] = useState('classic');
  
  // New interactive features
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTime, setTotalTime] = useState(0);
  const [lifelines, setLifelines] = useState({ fiftyFifty: 1, skip: 1, extraTime: 1 });
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  const TIME_PER_QUESTION = {
    easy: 45,
    medium: 30,
    hard: 20
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const shuffledQuestions = [...commonQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, gameMode === 'blitz' ? 15 : 10);
    setQuestions(shuffledQuestions);
    setLoading(false);
  }, [gameMode]);

  useEffect(() => {
    if (quizStarted && !showCountdown) {
      fetchQuestions();
    }
  }, [quizStarted, showCountdown, fetchQuestions]);

  // Countdown before quiz starts
  useEffect(() => {
    if (showCountdown && countdownNumber > 0) {
      const timer = setTimeout(() => setCountdownNumber(countdownNumber - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdownNumber === 0) {
      setShowCountdown(false);
      setQuizStarted(true);
    }
  }, [showCountdown, countdownNumber]);

  // Timer for each question
  useEffect(() => {
    if (quizStarted && !showResults && !isPaused && questions.length > 0) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
          setTotalTime(totalTime + 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Time's up - auto submit with wrong answer
        handleAnswer(null, true);
      }
    }
  }, [timeLeft, quizStarted, showResults, isPaused, questions.length]);

  // Reset timer when question changes
  useEffect(() => {
    if (quizStarted && questions.length > 0) {
      setTimeLeft(TIME_PER_QUESTION[difficulty]);
      setUsedFiftyFifty(false);
    }
  }, [currentQuestion, quizStarted, questions.length, difficulty]);

  const calculatePoints = (isCorrect, timeTaken) => {
    if (!isCorrect) return 0;
    const basePoints = { easy: 100, medium: 150, hard: 200 }[difficulty];
    const timeBonus = Math.floor((timeLeft / TIME_PER_QUESTION[difficulty]) * 50);
    const streakBonus = streak * 25;
    return basePoints + timeBonus + streakBonus;
  };

  const handleAnswer = (answer, timedOut = false) => {
    const isCorrect = answer === questions[currentQuestion]?.correctAnswer;
    const pointsEarned = calculatePoints(isCorrect, TIME_PER_QUESTION[difficulty] - timeLeft);
    
    if (isCorrect) {
      setScore(score + pointsEarned);
      setStreak(streak + 1);
      if (streak + 1 > maxStreak) setMaxStreak(streak + 1);
    } else {
      setStreak(0);
    }

    const newAnswers = [...answers, { answer, timedOut, timeTaken: TIME_PER_QUESTION[difficulty] - timeLeft, points: pointsEarned }];
    setAnswers(newAnswers);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const useFiftyFifty = () => {
    if (lifelines.fiftyFifty > 0 && !usedFiftyFifty) {
      setLifelines({ ...lifelines, fiftyFifty: lifelines.fiftyFifty - 1 });
      setUsedFiftyFifty(true);
      return true;
    }
    return false;
  };

  const useSkip = () => {
    if (lifelines.skip > 0) {
      setLifelines({ ...lifelines, skip: lifelines.skip - 1 });
      handleAnswer('SKIPPED', false);
    }
  };

  const useExtraTime = () => {
    if (lifelines.extraTime > 0) {
      setLifelines({ ...lifelines, extraTime: lifelines.extraTime - 1 });
      setTimeLeft(timeLeft + 15);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalTime(0);
    setLifelines({ fiftyFifty: 1, skip: 1, extraTime: 1 });
    setShowCountdown(false);
    setCountdownNumber(3);
    fetchQuestions();
  };

  const startGame = () => {
    setShowCountdown(true);
  };

  // Countdown screen
  if (showCountdown) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center">
          <div className="text-9xl font-bold neon-text animate-pulse mb-8">
            {countdownNumber || 'GO!'}
          </div>
          <p className="text-2xl text-cyan-300">Get Ready!</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center slide-in max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 neon-text">⚡ QUIZ APP ⚡</h1>
          <p className="text-xl mb-8 text-cyan-300">Test your knowledge in style</p>
          
          {/* Game Mode Selection */}
          <div className="mb-8">
            <h3 className="text-lg text-pink-400 mb-4 font-bold">SELECT MODE</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => setGameMode('classic')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  gameMode === 'classic' 
                    ? 'neon-glow text-cyan-400' 
                    : 'border border-gray-600 text-gray-400 hover:border-cyan-400'
                }`}
              >
                🎯 Classic
              </button>
              <button
                onClick={() => setGameMode('blitz')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  gameMode === 'blitz' 
                    ? 'neon-pink text-pink-400' 
                    : 'border border-gray-600 text-gray-400 hover:border-pink-400'
                }`}
              >
                ⚡ Blitz (15 Qs)
              </button>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h3 className="text-lg text-pink-400 mb-4 font-bold">SELECT DIFFICULTY</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {['easy', 'medium', 'hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                    difficulty === diff 
                      ? diff === 'easy' ? 'bg-green-900 border-green-400 text-green-400 shadow-green-glow' 
                        : diff === 'medium' ? 'bg-yellow-900 border-yellow-400 text-yellow-400 shadow-yellow-glow'
                        : 'bg-red-900 border-red-400 text-red-400 shadow-red-glow'
                      : 'border border-gray-600 text-gray-400 hover:border-gray-400'
                  }`}
                  style={{
                    boxShadow: difficulty === diff ? 
                      diff === 'easy' ? '0 0 20px #22c55e' :
                      diff === 'medium' ? '0 0 20px #eab308' :
                      '0 0 20px #ef4444' : 'none'
                  }}
                >
                  {diff === 'easy' ? '🟢 Easy (45s)' : diff === 'medium' ? '🟡 Medium (30s)' : '🔴 Hard (20s)'}
                </button>
              ))}
            </div>
          </div>

          {/* Features Info */}
          <div className="mb-8 bg-gray-900 bg-opacity-50 p-6 rounded-xl border border-cyan-900">
            <h3 className="text-lg text-cyan-400 mb-4 font-bold">🎮 FEATURES</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-gray-300">Timer</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-gray-300">Streak Bonus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-gray-300">50-50 Lifeline</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">⏭️</div>
                <div className="text-gray-300">Skip Question</div>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="bg-transparent text-cyan-400 font-bold py-4 px-12 rounded-lg neon-glow hover:text-white transition-all duration-300 text-2xl pulse-glow"
          >
            🚀 START QUIZ
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <Results 
        answers={answers} 
        questions={questions} 
        onRestart={resetQuiz}
        score={score}
        maxStreak={maxStreak}
        totalTime={totalTime}
        difficulty={difficulty}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      {/* Top Stats Bar */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="bg-gray-900 bg-opacity-80 px-4 py-2 rounded-lg border border-cyan-800">
            <span className="text-cyan-400 font-bold">💰 {score}</span>
          </div>
          {streak > 1 && (
            <div className="bg-orange-900 bg-opacity-80 px-4 py-2 rounded-lg border border-orange-400 animate-pulse">
              <span className="text-orange-400 font-bold">🔥 {streak} Streak!</span>
            </div>
          )}
        </div>
        
        {/* Lifelines */}
        <div className="flex gap-2">
          <button
            onClick={useFiftyFifty}
            disabled={lifelines.fiftyFifty === 0 || usedFiftyFifty}
            className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
              lifelines.fiftyFifty > 0 && !usedFiftyFifty
                ? 'bg-purple-900 border border-purple-400 text-purple-400 hover:bg-purple-800'
                : 'bg-gray-800 border border-gray-600 text-gray-600 cursor-not-allowed'
            }`}
            title="Remove 2 wrong answers"
          >
            🎯 50:50
          </button>
          <button
            onClick={useExtraTime}
            disabled={lifelines.extraTime === 0}
            className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
              lifelines.extraTime > 0
                ? 'bg-blue-900 border border-blue-400 text-blue-400 hover:bg-blue-800'
                : 'bg-gray-800 border border-gray-600 text-gray-600 cursor-not-allowed'
            }`}
            title="Add 15 seconds"
          >
            ⏱️ +15s
          </button>
          <button
            onClick={useSkip}
            disabled={lifelines.skip === 0}
            className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${
              lifelines.skip > 0
                ? 'bg-yellow-900 border border-yellow-400 text-yellow-400 hover:bg-yellow-800'
                : 'bg-gray-800 border border-gray-600 text-gray-600 cursor-not-allowed'
            }`}
            title="Skip this question"
          >
            ⏭️ Skip
          </button>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 flex items-center justify-center">
        <Question
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          timeLeft={timeLeft}
          maxTime={TIME_PER_QUESTION[difficulty]}
          streak={streak}
          usedFiftyFifty={usedFiftyFifty}
          onUseFiftyFifty={useFiftyFifty}
        />
      </div>
    </div>
  );
};

export default Quiz;