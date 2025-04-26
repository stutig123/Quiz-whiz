
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard from "@/components/Dashboard";
import ActivityForm from "@/components/ActivityForm";
import ActivityHistory from "@/components/ActivityHistory";
import GoalSettings from "@/components/GoalSettings";
import { Button } from "@/components/ui/button";
import { useFitness } from "@/context/FitnessContext";
import { createNewActivity } from "@/lib/fitness-utils";

export default function FitnessLayout() {
  const {
    quote,
    activities,
    goals,
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
  } = useFitness();

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
