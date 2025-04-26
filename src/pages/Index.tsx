
import React, { useEffect, useState } from "react";
import { FitnessActivity, FitnessGoal } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/Dashboard";
import ActivityForm from "@/components/ActivityForm";
import ActivityHistory from "@/components/ActivityHistory";
import GoalSettings from "@/components/GoalSettings";
import { createNewActivity, createNewGoal, getRandomQuote } from "@/lib/fitness-utils";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample activities data
const sampleActivities: FitnessActivity[] = [
  {
    id: "1",
    type: "Running",
    duration: 45,
    calories: 450,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Yesterday
    notes: "Morning run in the park",
  },
  {
    id: "2",
    type: "Weightlifting",
    duration: 60,
    calories: 300,
    date: new Date().toISOString().split("T")[0], // Today
    notes: "Leg day",
  },
  {
    id: "3",
    type: "Swimming",
    duration: 30,
    calories: 350,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days ago
    notes: "Pool laps",
  },
];

// Sample goal data
const sampleGoal: FitnessGoal = {
  id: "1",
  type: "caloriesBurned",
  target: 2000,
  period: "weekly",
  startDate: new Date().toISOString().split("T")[0],
};

export default function Index() {
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
    
    // Set a random motivational quote
    setQuote(getRandomQuote());
  }, []);
  
  // Save data to localStorage whenever it changes
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
    const newActivities = [...activities, activity];
    setActivities(newActivities);
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
    const newActivities = activities.filter((activity) => activity.id !== id);
    setActivities(newActivities);
    toast({
      title: "Activity deleted",
      description: "Your activity has been removed.",
    });
  };
  
  const handleAddGoal = (goal: FitnessGoal) => {
    const newGoals = [...goals, goal];
    setGoals(newGoals);
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
    const newGoals = goals.filter((goal) => goal.id !== id);
    setGoals(newGoals);
    toast({
      title: "Goal deleted",
      description: "Your fitness goal has been removed.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Fitness Tracker</h1>
      <div className="italic text-center text-sm mb-6 bg-muted p-3 rounded-md">{quote}</div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="history">Activity History</TabsTrigger>
          <TabsTrigger value="goals">Goal Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Dashboard activities={activities} goals={goals} />
          
          {isAddingActivity ? (
            <div className="mt-8 bg-card p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Log New Activity</h3>
              <ActivityForm 
                onSubmit={handleAddActivity} 
                onCancel={() => setIsAddingActivity(false)}
                initialData={createNewActivity()} 
              />
            </div>
          ) : (
            <Button 
              className="mt-8" 
              onClick={() => setIsAddingActivity(true)}
            >
              Log New Activity
            </Button>
          )}
        </TabsContent>

        <TabsContent value="history">
          <ActivityHistory 
            activities={activities} 
            onEdit={setEditingActivity} 
            onDelete={handleDeleteActivity} 
          />
          
          {editingActivity && (
            <div className="mt-8 bg-card p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Edit Activity</h3>
              <ActivityForm 
                onSubmit={handleUpdateActivity} 
                onCancel={() => setEditingActivity(null)} 
                initialData={editingActivity} 
                isEditing={true}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals">
          <GoalSettings 
            goals={goals} 
            onAdd={handleAddGoal} 
            onUpdate={handleUpdateGoal} 
            onDelete={handleDeleteGoal} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
