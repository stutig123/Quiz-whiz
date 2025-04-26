
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz } from "@/types/quiz";

interface QuizCardProps {
  quiz: Quiz;
  onStart: (quizId: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStart }) => {
  return (
    <Card className="quiz-transition hover:shadow-md border-2 hover:border-quiz-primary">
      <CardHeader>
        <CardTitle className="text-quiz-primary">{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="flex justify-between">
            <span>Questions:</span>
            <span className="font-medium">{quiz.questions.length}</span>
          </p>
          <p className="flex justify-between">
            <span>Time limit:</span>
            <span className="font-medium">{quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No limit"}</span>
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-quiz-primary hover:bg-quiz-dark"
          onClick={() => onStart(quiz.id)}
        >
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
