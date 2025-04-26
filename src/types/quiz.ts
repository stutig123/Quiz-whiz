
export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number | null; // in minutes, null means no limit
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
}
