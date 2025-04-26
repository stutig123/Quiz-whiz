
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isLastQuestion: boolean;
  isSubmitted: boolean;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isLastQuestion,
  isSubmitted,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-quiz-primary h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Question {currentQuestion + 1} of {totalQuestions}
      </p>
      
      <div className="flex justify-between w-full mt-2">
        <Button 
          variant="outline" 
          onClick={onPrevious} 
          disabled={currentQuestion === 0 || isSubmitted}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        
        {isLastQuestion ? (
          <Button 
            onClick={onSubmit} 
            className="bg-quiz-primary hover:bg-quiz-dark"
            disabled={isSubmitted}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button 
            onClick={onNext} 
            disabled={isSubmitted}
            className="flex items-center gap-1 bg-quiz-primary hover:bg-quiz-dark"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizNavigation;
