
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuizTimerProps {
  timeLimit: number; // in minutes
  onTimeUp: () => void;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ timeLimit, onTimeUp }) => {
  const totalSeconds = timeLimit * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    if (timeLeft <= totalSeconds * 0.25) {
      setIsWarning(true);
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, totalSeconds, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentageLeft = (timeLeft / totalSeconds) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Time Remaining</span>
        <span className={`font-medium ${isWarning ? "text-orange-500" : ""}`}>
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <Progress
        value={percentageLeft}
        className={cn("h-2", isWarning ? "bg-secondary [&>div]:bg-orange-500" : "bg-secondary [&>div]:bg-quiz-primary")}
      />
    </div>
  );
};

export default QuizTimer;
