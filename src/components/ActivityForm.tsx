
import React, { useState } from "react";
import { FitnessActivity } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { activityTypes } from "@/lib/fitness-utils";
import { v4 as uuidv4 } from "uuid";

interface ActivityFormProps {
  initialData: FitnessActivity;
  onSubmit: (activity: FitnessActivity) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isEditing = false 
}) => {
  const [activity, setActivity] = useState<FitnessActivity>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric values
    if (name === "duration" || name === "calories") {
      setActivity({
        ...activity,
        [name]: parseInt(value, 10) || 0,
      });
    } else {
      setActivity({
        ...activity,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const submittedActivity = {
      ...activity,
      id: isEditing ? activity.id : uuidv4(),
    };
    onSubmit(submittedActivity);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Activity Type</Label>
          <select
            id="type"
            name="type"
            value={activity.type}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {activityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={activity.date}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            min="1"
            value={activity.duration}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="calories">Calories Burned</Label>
          <Input
            id="calories"
            name="calories"
            type="number"
            min="1"
            value={activity.calories}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          value={activity.notes || ""}
          onChange={handleChange}
          placeholder="Add any notes about this activity..."
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {isEditing ? "Update Activity" : "Add Activity"}
        </Button>
      </div>
    </div>
  );
};

export default ActivityForm;
