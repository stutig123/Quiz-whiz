
import { FitnessActivity, FitnessGoal } from "@/types/fitness";
import { v4 as uuidv4 } from "uuid";

// Activity type options
export const activityTypes = [
  "Running",
  "Walking",
  "Cycling",
  "Swimming",
  "Weightlifting",
  "Yoga",
  "HIIT",
  "Basketball",
  "Soccer",
  "Tennis",
  "Dancing",
  "Pilates",
  "Hiking",
  "Rowing",
  "Elliptical",
];

// Calculate total calories burned from activities
export const calculateTotalCalories = (activities: FitnessActivity[]): number => {
  return activities.reduce((total, activity) => total + activity.calories, 0);
};

// Calculate total duration from activities
export const calculateTotalDuration = (activities: FitnessActivity[]): number => {
  return activities.reduce((total, activity) => total + activity.duration, 0);
};

// Generate a new activity with default values
export const createNewActivity = (): FitnessActivity => {
  return {
    id: uuidv4(),
    type: "Running",
    duration: 30,
    calories: 300,
    date: new Date().toISOString().split("T")[0],
    notes: "",
  };
};

// Generate a new goal with default values
export const createNewGoal = (): FitnessGoal => {
  return {
    id: uuidv4(),
    type: "caloriesBurned",
    target: 2000,
    period: "weekly",
    startDate: new Date().toISOString().split("T")[0],
  };
};

// Get activities for the current week
export const getActivitiesForCurrentWeek = (activities: FitnessActivity[]): FitnessActivity[] => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  return activities.filter((activity) => {
    const activityDate = new Date(activity.date);
    return activityDate >= startOfWeek && activityDate <= endOfWeek;
  });
};

// Format date for display (YYYY-MM-DD to MM/DD/YYYY)
export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
};

// Generate random motivational quotes
export const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "The difference between try and triumph is a little umph.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "The hard days are the best because that's when champions are made.",
  "Don't limit your challenges. Challenge your limits.",
  "Do something today that your future self will thank you for.",
  "The only way to do great work is to love what you do.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Your health is an investment, not an expense.",
];

export const getRandomQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

// Get activities grouped by day for the current week
export const getWeeklyActivityData = (activities: FitnessActivity[]) => {
  const weeklyActivities = getActivitiesForCurrentWeek(activities);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Initialize data structure with zeros
  const data = dayNames.map((day) => ({ name: day, calories: 0 }));
  
  // Populate with actual data
  weeklyActivities.forEach((activity) => {
    const date = new Date(activity.date);
    const dayIndex = date.getDay(); // 0 = Sunday, 6 = Saturday
    data[dayIndex].calories += activity.calories;
  });
  
  return data;
};

// Calculate goal progress
export const calculateGoalProgress = (goal: FitnessGoal, activities: FitnessActivity[]): number => {
  let relevantActivities: FitnessActivity[] = [];
  const today = new Date();
  const startDate = new Date(goal.startDate);
  
  // Filter activities based on goal period
  switch (goal.period) {
    case "daily":
      relevantActivities = activities.filter(
        (a) => new Date(a.date).toDateString() === today.toDateString()
      );
      break;
    case "weekly":
      relevantActivities = getActivitiesForCurrentWeek(activities);
      break;
    case "monthly":
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      relevantActivities = activities.filter((a) => {
        const date = new Date(a.date);
        return date >= startOfMonth && date <= endOfMonth;
      });
      break;
  }
  
  // Calculate progress based on goal type
  let achieved = 0;
  if (goal.type === "caloriesBurned") {
    achieved = calculateTotalCalories(relevantActivities);
  } else if (goal.type === "durationMinutes") {
    achieved = calculateTotalDuration(relevantActivities);
  }
  
  return Math.min((achieved / goal.target) * 100, 100);
};

// Export activity data as JSON
export const exportActivitiesAsJson = (activities: FitnessActivity[]) => {
  const dataStr = JSON.stringify(activities, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileDefaultName = `fitness-activities-${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};
