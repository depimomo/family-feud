import React, { useState } from 'react';
import { Trophy, ArrowRight, Send } from 'lucide-react';

interface Answer {
  text: string;
  points: number;
  isRevealed: boolean;
}

interface Level {
  question: string;
  answers: Answer[];
}

function App() {
  const levels: Level[] = [
    {
      question: "Name a popular food item you'd find at a restaurant.",
      answers: [
        { text: "Pizza", points: 35, isRevealed: false },
        { text: "Burger", points: 25, isRevealed: false },
        { text: "Sushi", points: 15, isRevealed: false },
        { text: "Pasta", points: 10, isRevealed: false },
        { text: "Tacos", points: 8, isRevealed: false },
        { text: "Salad", points: 4, isRevealed: false },
        { text: "Steak", points: 2, isRevealed: false },
        { text: "Ice Cream", points: 1, isRevealed: false },
      ]
    },
    {
      question: "Name something people do to stay healthy.",
      answers: [
        { text: "Exercise", points: 40, isRevealed: false },
        { text: "Eat Well", points: 30, isRevealed: false },
        { text: "Sleep", points: 15, isRevealed: false },
        { text: "Drink Water", points: 8, isRevealed: false },
        { text: "Meditate", points: 4, isRevealed: false },
        { text: "Take Vitamins", points: 2, isRevealed: false },
        { text: "Regular Checkups", points: 1, isRevealed: false },
        { text: "Reduce Stress", points: 1, isRevealed: false },
      ]
    },
    {
      question: "Name a popular vacation destination.",
      answers: [
        { text: "Hawaii", points: 35, isRevealed: false },
        { text: "Paris", points: 25, isRevealed: false },
        { text: "Disney World", points: 20, isRevealed: false },
        { text: "Las Vegas", points: 10, isRevealed: false },
        { text: "New York", points: 5, isRevealed: false },
        { text: "Caribbean", points: 3, isRevealed: false },
        { text: "London", points: 1, isRevealed: false },
        { text: "Tokyo", points: 1, isRevealed: false },
      ]
    }
  ];

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(levels[0].question);
  const [answers, setAnswers] = useState<Answer[]>(levels[0].answers);
  const [guess, setGuess] = useState('');
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);

  const revealAnswer = (index: number) => {
    const answer = answers[index];
    if (!answer.isRevealed) {
      setTotalScore(prev => prev + answer.points);
      setAnswers(answers.map((a, i) => 
        i === index ? { ...a, isRevealed: true } : a
      ));
    }
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const guessLower = guess.toLowerCase().trim();
    
    let foundMatch = false;
    answers.forEach((answer, index) => {
      if (!answer.isRevealed && answer.text.toLowerCase() === guessLower) {
        revealAnswer(index);
        foundMatch = true;
      }
    });
    
    if (!foundMatch) {
      setIsWrongAnswer(true);
      setTimeout(() => setIsWrongAnswer(false), 500);
    }
    
    setGuess('');
  };

  const nextLevel = () => {
    const nextIndex = (currentLevelIndex + 1) % levels.length;
    setCurrentLevelIndex(nextIndex);
    setCurrentQuestion(levels[nextIndex].question);
    setAnswers(levels[nextIndex].answers);
    setGuess('');
  };

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center p-8">
      {/* Score Board */}
      <div className="bg-black rounded-full p-8 mb-8 border-4 border-yellow-400">
        <div className="flex items-center gap-4">
          <Trophy size={32} className="text-yellow-400" />
          <span className="text-6xl font-bold text-yellow-400">{totalScore}</span>
        </div>
      </div>

      {/* Question Section */}
      <div className="bg-black p-6 rounded-xl w-full max-w-4xl mb-8 border-4 border-blue-400">
        <div className="flex items-center justify-center">
          <p className="text-white text-3xl font-bold text-center py-4">
            {currentQuestion}
          </p>
        </div>
      </div>

      {/* Answer Board */}
      <div className="bg-black p-8 rounded-xl w-full max-w-4xl mb-8">
        <div className="grid grid-cols-2 gap-4">
          {answers.map((answer, index) => (
            <div
              key={index}
              className={`h-20 rounded-lg flex items-center justify-between px-6 ${
                answer.isRevealed 
                  ? 'bg-blue-600 text-white' 
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
          className={`flex-1 px-6 py-4 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            isWrongAnswer ? 'shake bg-red-100' : 'bg-white'
          }`}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-2 transition-colors duration-300"
        >
          <span>Guess</span>
          <Send size={24} />
        </button>
      </form>

      {/* Next Level Button */}
      <button
        onClick={nextLevel}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full flex items-center gap-2 transition-colors duration-300"
      >
        <span>Next Level</span>
        <ArrowRight size={24} />
      </button>
    </div>
  );
}

export default App;