import React, { useState } from 'react';
import { Trophy, Send, Heart } from 'lucide-react';
import levelsData from './data/levels.json';

interface Answer {
  text: string;
  points: number;
  isRevealed: boolean;
}

interface Level {
  id: string;
  question: string;
  answers: Answer[];
}

function App() {
  const levels: Level[] = levelsData.levels;
  const [totalScore, setTotalScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(levels[0].question);
  const [answers, setAnswers] = useState<Answer[]>(levels[0].answers);
  const [guess, setGuess] = useState('');
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [lives, setLives] = useState(3);
  const [showWrongOverlay, setShowWrongOverlay] = useState(false);

  const revealAnswer = (index: number) => {
    const answer = answers[index];
    if (!answer.isRevealed) {
      setTotalScore(prev => prev + answer.points);
      setAnswers(answers.map((a, i) => 
        i === index ? { ...a, isRevealed: true } : a
      ));
    }
  };

  const revealAllAnswers = () => {
    setAnswers(answers.map(answer => ({ ...answer, isRevealed: true })));
  };

  const shouldRevealAllAnswers = (remainingLives: number) => {
    return remainingLives < 0;
  }

  const isMatchingAnswer = (guess: string, answer: string): boolean => {
    const guessWords = guess.toLowerCase().trim().split(/\s+/);
    const answerWords = answer.toLowerCase().split(/\s+/);

    // Check for exact match first
    if (guess.toLowerCase().trim() === answer.toLowerCase()) {
      return true;
    }

    // Check for singular/plural variations
    if (answer.toLowerCase().endsWith('s')) {
      const singular = answer.toLowerCase().slice(0, -1);
      if (guess.toLowerCase().trim() === singular) {
        return true;
      }
    }
    if (guess.toLowerCase().trim().endsWith('s')) {
      const singular = guess.toLowerCase().trim().slice(0, -1);
      if (singular === answer.toLowerCase()) {
        return true;
      }
    }

    // Check if the guess contains all main words from the answer
    // or if the answer contains all words from the guess
    const isGuessSubsetOfAnswer = guessWords.every(word => 
      answerWords.some(answerWord => 
        answerWord === word || 
        answerWord.startsWith(word) || 
        word.startsWith(answerWord)
      )
    );

    const isAnswerSubsetOfGuess = answerWords.every(word => 
      guessWords.some(guessWord => 
        guessWord === word || 
        guessWord.startsWith(word) || 
        word.startsWith(guessWord)
      )
    );

    return isGuessSubsetOfAnswer || isAnswerSubsetOfGuess;
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    
    let foundMatch = false;
    answers.forEach((answer, index) => {
      if (!answer.isRevealed && isMatchingAnswer(guess, answer.text)) {
        revealAnswer(index);
        foundMatch = true;
      }
    });
    
    if (!foundMatch) {
      setIsWrongAnswer(true);
      setShowWrongOverlay(true);
      setLives(prev => {
        const newLives = prev - 1;
        if (shouldRevealAllAnswers(newLives)) {
          revealAllAnswers();
        }
        return newLives;
      });
      setTimeout(() => {
        setIsWrongAnswer(false);
        setShowWrongOverlay(false);
      }, 1000);
    }
    
    setGuess('');
  };

  const goToLevel = (id: string) => {
    const level = levels.find(level => level.id === id);
    if (!level) {
      console.error(`Level with id "${id}" not found.`);
      return;
    }

    setCurrentQuestion(level?.question);
    setAnswers(level?.answers);
    setGuess('');
    setLives(3);
    setTotalScore(0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex flex-col items-center p-8 relative">
      {/* Wrong Answer Overlay */}
      {showWrongOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-red-600 transform scale-150">
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
      )}

      {/* Score and Lives */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        {/* Score Board */}
        <div 
          onClick={ revealAllAnswers }
          className="bg-black rounded-full p-8 border-4 border-yellow-400 glow-effect">
          <div className="flex items-center gap-4">
            <Trophy size={32} className="text-yellow-400" />
            <span className="text-6xl font-bold text-yellow-400">{totalScore}</span>
          </div>
        </div>

        {/* Lives */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, index) => (
            <Heart
              key={index}
              size={40}
              className={`${index < lives ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-gray-400'} pulse-effect`}
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Question Section */}
      <div className="bg-black p-6 rounded-xl w-full max-w-4xl mb-8 border-4 border-yellow-400 glow-effect">
        <div className="flex items-center justify-center">
          <p className="text-yellow-400 text-4xl font-bold text-center py-4 float-effect">
            {currentQuestion}
          </p>
        </div>
      </div>

      {/* Answer Board */}
      <div className="bg-black p-8 rounded-xl w-full max-w-4xl mb-8 border-4 border-yellow-400">
        <div className="grid grid-cols-1 gap-4">
          {answers.map((answer, index) => (
            <div
              key={index}
              className={`h-20 rounded-lg flex items-center justify-between px-6 transition-all duration-500 transform hover:scale-105 ${
                answer.isRevealed 
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-white shadow-lg' 
                  : 'bg-gray-700 text-transparent'
              }`}
            >
              <span className="text-2xl font-bold">
                {answer.isRevealed ? answer.text : 'X'}
              </span>
              <span className="text-2xl font-bold">
                {answer.isRevealed ? answer.points : 'X'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Guess Input */}
      <form onSubmit={handleGuess} className="w-full max-w-4xl mb-8 flex gap-4">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess..."
          className={`flex-1 px-6 py-4 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
            isWrongAnswer ? 'shake bg-red-100' : 'bg-white'
          }`}
          disabled={shouldRevealAllAnswers(lives)}
        />
        <button
          type="submit"
          className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
            shouldRevealAllAnswers(lives) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={shouldRevealAllAnswers(lives)}
        >
          <span>Guess</span>
          <Send size={24} />
        </button>
      </form>

      {/* Navigation Buttons */}
      <div className="flex flex-row space-x-2 overflow-x-auto bg-transparent">
        { levels.map(level => (
          <button 
            onClick={() => goToLevel(level.id)}
            className={`bg-green-400 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full flex items-center gap-2 transition-all duration-300 transform hover:scale-105`}
            >
            { level.id }
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;