import React, { createContext, useState } from 'react';

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  const addAnswer = (answer) => {
    setAnswers([...answers, answer]);
  };

  const calculateScore = (questions) => {
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  };

  return (
    <QuizContext.Provider value={{ answers, score, addAnswer, calculateScore }}>
      {children}
    </QuizContext.Provider>
  );
};
