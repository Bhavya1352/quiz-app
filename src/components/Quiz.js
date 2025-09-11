import React, { useState, useEffect } from 'react';
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

  const fetchQuestions = async () => {
    setLoading(true);
    const shuffledQuestions = [...commonQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setQuestions(shuffledQuestions);
    setLoading(false);
  };

  useEffect(() => {
    if (quizStarted) {
      fetchQuestions();
    }
  }, [quizStarted]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
    fetchQuestions();
  };

  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center slide-in">
          <h1 className="text-6xl font-bold mb-8 neon-text">NEON QUIZ</h1>
          <p className="text-xl mb-12 text-cyan-300">Test your knowledge in style</p>
          <button
            onClick={() => setQuizStarted(true)}
            className="bg-transparent text-cyan-400 font-bold py-4 px-8 rounded-lg neon-glow hover:text-white transition-all duration-300 text-xl"
          >
            START QUIZ
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return <Results answers={answers} questions={questions} onRestart={resetQuiz} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Question
        question={questions[currentQuestion]}
        questionNumber={currentQuestion + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default Quiz;