
import React, { createContext, useContext, useState, useEffect } from "react";
import { FitnessActivity, FitnessGoal } from "@/types/fitness";
import { createNewActivity, getRandomQuote } from "@/lib/fitness-utils";
import { toast } from "@/hooks/use-toast";

// Sample data moved from Index.tsx
const sampleActivities: FitnessActivity[] = [
  {
    id: "1",
    type: "Running",
    duration: 45,
    calories: 450,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Morning run in the park",
  },
  {
    id: "2",
    type: "Weightlifting",
    duration: 60,
    calories: 300,
    date: new Date().toISOString().split("T")[0],
    notes: "Leg day",
  },
  {
    id: "3",
    type: "Swimming",
    duration: 30,
    calories: 350,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Pool laps",
  },
];

const sampleGoal: FitnessGoal = {
  id: "1",
  type: "caloriesBurned",
  target: 2000,
  period: "weekly",
  startDate: new Date().toISOString().split("T")[0],
};

interface FitnessContextType {
  activities: FitnessActivity[];
  goals: FitnessGoal[];
  quote: string;
  isAddingActivity: boolean;
  editingActivity: FitnessActivity | null;
  setIsAddingActivity: (value: boolean) => void;
  setEditingActivity: (activity: FitnessActivity | null) => void;
  handleAddActivity: (activity: FitnessActivity) => void;
  handleUpdateActivity: (activity: FitnessActivity) => void;
  handleDeleteActivity: (id: string) => void;
  handleAddGoal: (goal: FitnessGoal) => void;
  handleUpdateGoal: (goal: FitnessGoal) => void;
  handleDeleteGoal: (id: string) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export function FitnessProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<FitnessActivity[]>([]);
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [quote, setQuote] = useState("");
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<FitnessActivity | null>(null);

  useEffect(() => {
    // Load data from localStorage or use sample data
    const storedActivities = localStorage.getItem("fitness-activities");
    const storedGoals = localStorage.getItem("fitness-goals");
    
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    } else {
      setActivities(sampleActivities);
    }
    
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    } else {
      setGoals([sampleGoal]);
    }
    
    setQuote(getRandomQuote());
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem("fitness-activities", JSON.stringify(activities));
    }
  }, [activities]);

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("fitness-goals", JSON.stringify(goals));
    }
  }, [goals]);

  const handleAddActivity = (activity: FitnessActivity) => {
    setActivities([...activities, activity]);
    setIsAddingActivity(false);
    toast({
      title: "Activity added",
      description: "Your activity has been successfully logged!",
    });
  };

  const handleUpdateActivity = (updatedActivity: FitnessActivity) => {
    const newActivities = activities.map((activity) =>
      activity.id === updatedActivity.id ? updatedActivity : activity
    );
    setActivities(newActivities);
    setEditingActivity(null);
    toast({
      title: "Activity updated",
      description: "Your activity has been successfully updated!",
    });
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id));
    toast({
      title: "Activity deleted",
      description: "Your activity has been removed.",
    });
  };

  const handleAddGoal = (goal: FitnessGoal) => {
    setGoals([...goals, goal]);
    toast({
      title: "Goal added",
      description: "Your fitness goal has been set!",
    });
  };

  const handleUpdateGoal = (updatedGoal: FitnessGoal) => {
    const newGoals = goals.map((goal) =>
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    setGoals(newGoals);
    toast({
      title: "Goal updated",
      description: "Your fitness goal has been updated!",
    });
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    toast({
      title: "Goal deleted",
      description: "Your fitness goal has been removed.",
    });
  };

  const value = {
    activities,
    goals,
    quote,
    isAddingActivity,
    editingActivity,
    setIsAddingActivity,
    setEditingActivity,
    handleAddActivity,
    handleUpdateActivity,
    handleDeleteActivity,
    handleAddGoal,
    handleUpdateGoal,
    handleDeleteGoal,
  };

  return <FitnessContext.Provider value={value}>{children}</FitnessContext.Provider>;
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error("useFitness must be used within a FitnessProvider");
  }
  return context;
}
