
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Quiz, Question } from "@/types/quiz";
import { v4 as uuidv4 } from "uuid";
import QuizHeader from "./QuizHeader";

interface QuizCreatorProps {
  onQuizCreate: (quiz: Quiz) => void;
  onCancel: () => void;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ onQuizCreate, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState<number | "">(10);
  const [questions, setQuestions] = useState<Partial<Question>[]>([
    createEmptyQuestion(),
    createEmptyQuestion(),
    createEmptyQuestion(),
  ]);
  
  function createEmptyQuestion(): Partial<Question> {
    return {
      id: uuidv4(),
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    };
  }
  
  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };
  
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    const options = [...updatedQuestions[questionIndex].options!];
    options[optionIndex] = value;
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], options };
    setQuestions(updatedQuestions);
  };
  
  const addQuestion = () => {
    setQuestions([...questions, createEmptyQuestion()]);
  };
  
  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };
  
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter a quiz title");
      return;
    }
    
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    
    // Validate questions
    const isValid = questions.every((q, index) => {
      if (!q.questionText?.trim()) {
        alert(`Question ${index + 1} is missing text`);
        return false;
      }
      
      if (!q.options?.every(option => option.trim())) {
        alert(`Question ${index + 1} has empty options`);
        return false;
      }
      
      if (!q.correctAnswer?.trim()) {
        alert(`Question ${index + 1} is missing a correct answer`);
        return false;
      }
      
      return true;
    });
    
    if (!isValid) return;
    
    const newQuiz: Quiz = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      timeLimit: timeLimit === "" ? null : timeLimit,
      questions: questions as Question[],
    };
    
    onQuizCreate(newQuiz);
  };

  return (
    <div className="container max-w-3xl mx-auto py-6">
      <QuizHeader title="Create New Quiz" subtitle="Build a custom educational quiz" />
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input 
              id="quiz-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Introduction to Psychology"
              className="border-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time-limit">Time Limit (minutes)</Label>
            <Input 
              id="time-limit" 
              type="number" 
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value ? Number(e.target.value) : "")} 
              min={1}
              placeholder="10"
              className="border-2"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quiz-description">Quiz Description</Label>
          <Textarea 
            id="quiz-description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="A comprehensive quiz covering basic psychology concepts"
            className="border-2 min-h-[80px]"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-quiz-primary">Questions</h3>
            <Button 
              onClick={addQuestion}
              variant="outline" 
              className="text-quiz-primary border-quiz-primary"
            >
              Add Question
            </Button>
          </div>
          
          {questions.map((question, qIndex) => (
            <Card key={question.id} className="border-2">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Question {qIndex + 1}</h4>
                  {questions.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 h-8"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`q-${qIndex}-text`}>Question Text</Label>
                    <Textarea 
                      id={`q-${qIndex}-text`} 
                      value={question.questionText || ""}
                      onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                      placeholder="Enter your question here"
                      className="border-2"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Answer Options</Label>
                    {question.options?.map((option, oIndex) => (
                      <div key={oIndex} className="flex gap-3">
                        <Input 
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="border-2"
                        />
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            name={`correct-${qIndex}`} 
                            id={`correct-${qIndex}-${oIndex}`}
                            checked={question.correctAnswer === option}
                            onChange={() => handleQuestionChange(qIndex, "correctAnswer", option)}
                            className="mr-2 h-4 w-4 text-quiz-primary"
                          />
                          <Label htmlFor={`correct-${qIndex}-${oIndex}`} className="cursor-pointer">
                            Correct
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`q-${qIndex}-explanation`}>Explanation (Optional)</Label>
                    <Textarea 
                      id={`q-${qIndex}-explanation`} 
                      value={question.explanation || ""}
                      onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)}
                      placeholder="Explain why this answer is correct"
                      className="border-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="bg-quiz-primary hover:bg-quiz-dark" onClick={handleSubmit}>
            Create Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;
