
import React, { useState } from "react";
import { FitnessGoal } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createNewGoal } from "@/lib/fitness-utils";
import { v4 as uuidv4 } from "uuid";
import { Pencil, Trash2, Plus } from "lucide-react";

interface GoalSettingsProps {
  goals: FitnessGoal[];
  onAdd: (goal: FitnessGoal) => void;
  onUpdate: (goal: FitnessGoal) => void;
  onDelete: (id: string) => void;
}

const GoalSettings: React.FC<GoalSettingsProps> = ({ goals, onAdd, onUpdate, onDelete }) => {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FitnessGoal | null>(null);
  const [formData, setFormData] = useState<FitnessGoal>(createNewGoal());

  const handleEditGoal = (goal: FitnessGoal) => {
    setFormData({ ...goal });
    setEditingGoal(goal);
    setIsAddingGoal(false);
  };

  const handleAddGoal = () => {
    setFormData(createNewGoal());
    setEditingGoal(null);
    setIsAddingGoal(true);
  };

  const handleCancel = () => {
    setIsAddingGoal(false);
    setEditingGoal(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "target") {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const submittedGoal = {
      ...formData,
      id: editingGoal ? editingGoal.id : uuidv4(),
    };
    
    if (editingGoal) {
      onUpdate(submittedGoal);
    } else {
      onAdd(submittedGoal);
    }
    
    setIsAddingGoal(false);
    setEditingGoal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Fitness Goals</h2>
        <Button onClick={handleAddGoal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      {/* Goal Form */}
      {(isAddingGoal || editingGoal) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingGoal ? "Edit Goal" : "Add New Goal"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="type">Goal Type</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="caloriesBurned">Calories Burned</option>
                  <option value="durationMinutes">Activity Duration</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="period">Time Period</Label>
                <select
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="target">
                  Target {formData.type === "caloriesBurned" ? "Calories" : "Minutes"}
                </Label>
                <Input
                  id="target"
                  name="target"
                  type="number"
                  min="1"
                  value={formData.target}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingGoal ? "Update Goal" : "Add Goal"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex justify-between">
                <span>
                  {goal.type === "caloriesBurned" ? "Calories Burned" : "Activity Duration"}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEditGoal(goal)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onDelete(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-xl font-bold">
                  {goal.target}{" "}
                  <span className="text-xs font-normal">
                    {goal.type === "caloriesBurned" ? "calories" : "minutes"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {goal.period.charAt(0).toUpperCase() + goal.period.slice(1)} goal
                </p>
                <p className="text-xs text-muted-foreground">
                  Starting from: {new Date(goal.startDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {goals.length === 0 && !isAddingGoal && (
          <div className="col-span-full text-center py-8 text-muted-foreground border rounded-lg">
            No goals set yet. Click "Add Goal" to create your first fitness goal!
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalSettings;
