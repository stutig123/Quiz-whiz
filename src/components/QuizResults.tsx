
import React from "react";
import { Button } from "@/components/ui/button";
import { Quiz, UserAnswer } from "@/types/quiz";

interface QuizResultsProps {
  quiz: Quiz;
  userAnswers: UserAnswer[];
  score: number;
  onReviewQuiz: () => void;
  onReturnToHome: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  userAnswers,
  score,
  onReviewQuiz,
  onReturnToHome,
}) => {
  const totalQuestions = quiz.questions.length;
  const correctAnswers = userAnswers.filter(
    (answer) => {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      return question?.correctAnswer === answer.selectedAnswer;
    }
  ).length;
  
  const percentageScore = Math.round((correctAnswers / totalQuestions) * 100);
  
  let message = "";
  let messageClass = "";
  
  if (percentageScore >= 90) {
    message = "Excellent work! You've mastered this topic!";
    messageClass = "text-green-600";
  } else if (percentageScore >= 70) {
    message = "Good job! You have a solid understanding of this material.";
    messageClass = "text-green-500";
  } else if (percentageScore >= 50) {
    message = "You passed, but there's room for improvement.";
    messageClass = "text-yellow-500";
  } else {
    message = "You might need to review this topic again.";
    messageClass = "text-red-500";
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
      
      <div className="w-40 h-40 rounded-full border-8 border-quiz-primary flex items-center justify-center mb-6">
        <span className="text-4xl font-bold text-quiz-primary">{percentageScore}%</span>
      </div>
      
      <p className={`text-lg font-medium ${messageClass} mb-4`}>
        {message}
      </p>
      
      <div className="flex gap-4 justify-center mb-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">{correctAnswers}</p>
          <p className="text-sm text-muted-foreground">Correct</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">{totalQuestions - correctAnswers}</p>
          <p className="text-sm text-muted-foreground">Incorrect</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{totalQuestions}</p>
          <p className="text-sm text-muted-foreground">Total</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          onClick={onReviewQuiz}
          variant="outline"
          className="border-quiz-primary text-quiz-primary hover:bg-quiz-accent"
        >
          Review Answers
        </Button>
        <Button
          onClick={onReturnToHome}
          className="bg-quiz-primary hover:bg-quiz-dark"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;
