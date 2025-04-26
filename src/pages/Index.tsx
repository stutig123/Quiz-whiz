
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Quiz, UserAnswer } from "@/types/quiz";
import { v4 as uuidv4 } from "uuid";
import QuizHeader from "@/components/QuizHeader";
import QuizCard from "@/components/QuizCard";
import QuizQuestion from "@/components/QuizQuestion";
import QuizNavigation from "@/components/QuizNavigation";
import QuizResults from "@/components/QuizResults";
import QuizTimer from "@/components/QuizTimer";
import QuizCreator from "@/components/QuizCreator";

// Sample quiz data
const sampleQuizzes: Quiz[] = [
  {
    id: "q1",
    title: "Introduction to Psychology",
    description: "Test your knowledge of basic psychology concepts and theories.",
    questions: [
      {
        id: "q1-1",
        questionText: "Which psychologist is known for classical conditioning experiments with dogs?",
        options: ["B.F. Skinner", "Ivan Pavlov", "Sigmund Freud", "Carl Jung"],
        correctAnswer: "Ivan Pavlov",
        explanation: "Ivan Pavlov conducted experiments with dogs that demonstrated classical conditioning, where a neutral stimulus becomes associated with a reflexive response."
      },
      {
        id: "q1-2",
        questionText: "What is the term for a mental shortcut that allows people to make decisions quickly?",
        options: ["Cognitive bias", "Heuristic", "Algorithm", "Schema"],
        correctAnswer: "Heuristic",
        explanation: "A heuristic is a mental shortcut that helps you make decisions quickly. While efficient, heuristics can sometimes lead to cognitive biases."
      },
      {
        id: "q1-3",
        questionText: "Which part of the brain is primarily responsible for decision making and impulse control?",
        options: ["Amygdala", "Hippocampus", "Prefrontal Cortex", "Cerebellum"],
        correctAnswer: "Prefrontal Cortex",
        explanation: "The prefrontal cortex is involved in complex cognitive behavior, decision making, and moderating social behavior and impulse control."
      }
    ],
    timeLimit: 5
  },
  {
    id: "q2",
    title: "World History: Ancient Civilizations",
    description: "Explore your knowledge about major ancient civilizations and their contributions.",
    questions: [
      {
        id: "q2-1",
        questionText: "Which ancient civilization built the Great Pyramids of Giza?",
        options: ["Mesopotamians", "Romans", "Greeks", "Egyptians"],
        correctAnswer: "Egyptians",
        explanation: "The Great Pyramids of Giza were built by the ancient Egyptians as tombs for their pharaohs and their consorts during the Old and Middle Kingdom periods."
      },
      {
        id: "q2-2",
        questionText: "Which philosopher is often credited with founding Western philosophy?",
        options: ["Aristotle", "Socrates", "Plato", "Pythagoras"],
        correctAnswer: "Socrates",
        explanation: "While Socrates did not leave any writings, his methods and ideas are known through the accounts of his students, particularly Plato. He is often credited as the founder of Western philosophy."
      },
      {
        id: "q2-3",
        questionText: "What was the main language of the Roman Empire?",
        options: ["Greek", "Latin", "Aramaic", "Hebrew"],
        correctAnswer: "Latin",
        explanation: "Latin was the official language of the Roman Empire, though Greek was also widely spoken, especially in the eastern provinces."
      }
    ],
    timeLimit: 8
  }
];

// Main component
const Index = () => {
  // States
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentView, setCurrentView] = useState<"dashboard" | "quiz" | "results" | "review" | "create">("dashboard");
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [score, setScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Load quizzes from localStorage or use sample data
  useEffect(() => {
    const savedQuizzes = localStorage.getItem("quizzes");
    if (savedQuizzes) {
      try {
        setQuizzes(JSON.parse(savedQuizzes));
      } catch (e) {
        console.error("Failed to parse saved quizzes:", e);
        setQuizzes(sampleQuizzes);
      }
    } else {
      setQuizzes(sampleQuizzes);
    }
  }, []);

  // Save quizzes to localStorage when they change
  useEffect(() => {
    if (quizzes.length > 0) {
      localStorage.setItem("quizzes", JSON.stringify(quizzes));
    }
  }, [quizzes]);

  // Start a quiz
  const handleStartQuiz = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz) {
      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setQuizSubmitted(false);
      setCurrentView("quiz");
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (currentQuiz && !quizSubmitted) {
      const currentQuestion = currentQuiz.questions[currentQuestionIndex];
      const existingAnswerIndex = userAnswers.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[existingAnswerIndex] = {
          ...updatedAnswers[existingAnswerIndex],
          selectedAnswer: answer,
        };
        setUserAnswers(updatedAnswers);
      } else {
        setUserAnswers([
          ...userAnswers,
          {
            questionId: currentQuestion.id,
            selectedAnswer: answer,
          },
        ]);
      }
    }
  };

  // Navigation functions
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Calculate score and submit quiz
  const handleSubmitQuiz = () => {
    if (currentQuiz) {
      let correctCount = 0;
      currentQuiz.questions.forEach((question) => {
        const userAnswer = userAnswers.find((a) => a.questionId === question.id);
        if (userAnswer && userAnswer.selectedAnswer === question.correctAnswer) {
          correctCount++;
        }
      });

      const finalScore = Math.round((correctCount / currentQuiz.questions.length) * 100);
      setScore(finalScore);
      setQuizSubmitted(true);
      setCurrentView("results");
    }
  };

  // Time up handler
  const handleTimeUp = () => {
    handleSubmitQuiz();
  };

  // Create new quiz
  const handleCreateQuiz = (quiz: Quiz) => {
    const updatedQuizzes = [...quizzes, quiz];
    setQuizzes(updatedQuizzes);
    setCurrentView("dashboard");
  };

  // Get current question and the selected answer
  const getCurrentQuestion = () => {
    if (!currentQuiz) return null;
    return currentQuiz.questions[currentQuestionIndex];
  };

  const getCurrentSelectedAnswer = () => {
    if (!currentQuiz) return null;
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const answer = userAnswers.find((a) => a.questionId === currentQuestion.id);
    return answer ? answer.selectedAnswer : null;
  };

  // Render functions
  const renderDashboard = () => (
    <div className="container mx-auto px-4 py-8">
      <QuizHeader 
        title="QuizWhiz" 
        subtitle="Elevate your knowledge with interactive educational quizzes" 
      />
      
      <div className="flex justify-end mb-6">
        <Button 
          onClick={() => setCurrentView("create")}
          className="bg-quiz-primary hover:bg-quiz-dark"
        >
          Create New Quiz
        </Button>
      </div>
      
      {quizzes.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-muted-foreground">No quizzes available. Create your first quiz!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard 
              key={quiz.id} 
              quiz={quiz} 
              onStart={handleStartQuiz} 
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderQuiz = () => {
    if (!currentQuiz) return null;
    
    const currentQuestion = getCurrentQuestion();
    const selectedAnswer = getCurrentSelectedAnswer();
    const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
    
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <QuizHeader title={currentQuiz.title} />
        
        {currentQuiz.timeLimit && !quizSubmitted && (
          <QuizTimer 
            timeLimit={currentQuiz.timeLimit} 
            onTimeUp={handleTimeUp} 
          />
        )}
        
        <Card className="p-6 border-2">
          <CardContent className="p-0">
            {currentQuestion && (
              <QuizQuestion
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                isReview={false}
                onAnswerSelect={handleAnswerSelect}
              />
            )}
            
            <QuizNavigation
              currentQuestion={currentQuestionIndex}
              totalQuestions={currentQuiz.questions.length}
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              onSubmit={handleSubmitQuiz}
              isLastQuestion={isLastQuestion}
              isSubmitted={quizSubmitted}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderResults = () => {
    if (!currentQuiz) return null;
    
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card className="p-8 border-2">
          <CardContent className="p-0">
            <QuizResults
              quiz={currentQuiz}
              userAnswers={userAnswers}
              score={score}
              onReviewQuiz={() => setCurrentView("review")}
              onReturnToHome={() => setCurrentView("dashboard")}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderReview = () => {
    if (!currentQuiz) return null;
    
    const currentQuestion = getCurrentQuestion();
    const selectedAnswer = getCurrentSelectedAnswer();
    const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
    
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <QuizHeader title={`Review: ${currentQuiz.title}`} />
        
        <Card className="p-6 border-2">
          <CardContent className="p-0">
            {currentQuestion && (
              <QuizQuestion
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                isReview={true}
                onAnswerSelect={() => {}}
              />
            )}
            
            <QuizNavigation
              currentQuestion={currentQuestionIndex}
              totalQuestions={currentQuiz.questions.length}
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              onSubmit={() => setCurrentView("results")}
              isLastQuestion={isLastQuestion}
              isSubmitted={false}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setCurrentView("results")}
            variant="outline"
            className="border-quiz-primary text-quiz-primary"
          >
            Back to Results
          </Button>
        </div>
      </div>
    );
  };

  const renderCreateQuiz = () => (
    <QuizCreator
      onQuizCreate={handleCreateQuiz}
      onCancel={() => setCurrentView("dashboard")}
    />
  );

  // Main render
  switch (currentView) {
    case "dashboard":
      return renderDashboard();
    case "quiz":
      return renderQuiz();
    case "results":
      return renderResults();
    case "review":
      return renderReview();
    case "create":
      return renderCreateQuiz();
    default:
      return renderDashboard();
  }
};

export default Index;
