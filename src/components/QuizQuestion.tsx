
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "@/types/quiz";

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  isReview: boolean;
  onAnswerSelect: (answer: string) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  isReview,
  onAnswerSelect,
}) => {
  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">{question.questionText}</h3>
      
      <RadioGroup
        value={selectedAnswer || undefined}
        onValueChange={onAnswerSelect}
        className="space-y-3"
      >
        {question.options.map((option, index) => {
          const optionId = `option-${index}`;
          const isCorrect = option === question.correctAnswer;
          const isSelected = option === selectedAnswer;
          
          let optionClassName = "flex items-center border-2 rounded-md p-4 option-hover";
          
          if (isReview) {
            if (isCorrect) {
              optionClassName += " bg-green-100 border-green-500";
            } else if (isSelected && !isCorrect) {
              optionClassName += " bg-red-100 border-red-500";
            }
          } else if (isSelected) {
            optionClassName += " border-quiz-primary bg-quiz-accent";
          } else {
            optionClassName += " border-gray-200";
          }

          return (
            <div key={optionId} className={optionClassName}>
              <RadioGroupItem
                value={option}
                id={optionId}
                disabled={isReview}
                className="mr-3"
              />
              <Label htmlFor={optionId} className="flex-1 cursor-pointer">
                {option}
              </Label>
              
              {isReview && isCorrect && (
                <span className="text-green-600 ml-2 text-sm">Correct answer</span>
              )}
              {isReview && isSelected && !isCorrect && (
                <span className="text-red-600 ml-2 text-sm">Your answer</span>
              )}
            </div>
          );
        })}
      </RadioGroup>
      
      {isReview && question.explanation && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-semibold text-blue-800">Explanation:</h4>
          <p className="text-blue-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
