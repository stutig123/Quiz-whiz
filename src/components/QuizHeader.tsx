
import React from "react";

interface QuizHeaderProps {
  title: string;
  subtitle?: string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-quiz-primary mb-2">{title}</h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};

export default QuizHeader;
