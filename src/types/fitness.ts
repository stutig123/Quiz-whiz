
export interface FitnessActivity {
  id: string;
  type: string;
  duration: number; // in minutes
  calories: number;
  date: string; // ISO string format
  notes?: string;
}

export interface FitnessGoal {
  id: string;
  type: "caloriesBurned" | "durationMinutes";
  target: number;
  period: "daily" | "weekly" | "monthly";
  startDate: string; // ISO string format
}
