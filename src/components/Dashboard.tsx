
import React from "react";
import { FitnessActivity, FitnessGoal } from "@/types/fitness";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  calculateTotalCalories, 
  calculateTotalDuration, 
  getActivitiesForCurrentWeek,
  calculateGoalProgress,
  getWeeklyActivityData,
  exportActivitiesAsJson
} from "@/lib/fitness-utils";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Calendar, Download, Weight } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface DashboardProps {
  activities: FitnessActivity[];
  goals: FitnessGoal[];
}

const Dashboard: React.FC<DashboardProps> = ({ activities, goals }) => {
  const weeklyActivities = getActivitiesForCurrentWeek(activities);
  const totalCalories = calculateTotalCalories(weeklyActivities);
  const totalDuration = calculateTotalDuration(weeklyActivities);
  const chartData = getWeeklyActivityData(activities);
  
  // Calculate daily average calories
  const dailyAverageCalories = weeklyActivities.length > 0 
    ? Math.round(totalCalories / weeklyActivities.length) 
    : 0;
  
  // Calculate calories per minute
  const caloriesPerMinute = totalDuration > 0 
    ? Math.round((totalCalories / totalDuration) * 10) / 10 
    : 0;
  
  const chartConfig = {
    calories: { label: "Calories", color: "var(--primary)" },
  };
  
  return (
    <div className="grid gap-8">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Weekly Calories</CardTitle>
            <Flame className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories}</div>
            <p className="text-xs text-muted-foreground">calories burned this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <Weight className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyAverageCalories}</div>
            <p className="text-xs text-muted-foreground">calories per active day</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
            <Flame className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{caloriesPerMinute}</div>
            <p className="text-xs text-muted-foreground">calories per minute</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Activities Logged</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyActivities.length}</div>
            <p className="text-xs text-muted-foreground">workouts this week</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Goals Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Goals</h2>
        {goals.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {goals.map((goal) => {
              const progress = calculateGoalProgress(goal, activities);
              return (
                <Card key={goal.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {goal.type === "caloriesBurned" ? "Calorie Goal" : "Activity Duration Goal"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progress} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{`Target: ${goal.target} ${
                        goal.type === "caloriesBurned" ? "calories" : "minutes"
                      }`}</span>
                      <span>{`${Math.round(progress)}% Complete`}</span>
                    </div>
                    <div className="text-xs mt-2">
                      {goal.period.charAt(0).toUpperCase() + goal.period.slice(1)} goal
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No goals set yet. Add a goal to track your progress!</p>
        )}
      </div>
      
      {/* Weekly Activity Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Weekly Calorie Burn</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig}>
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  label={{ value: 'Day of Week', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Calories Burned', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 10
                  }}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="calories"
                  name="Calories"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Export Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline"
          className="gap-2"
          onClick={() => exportActivitiesAsJson(activities)}
        >
          <Download className="h-4 w-4" />
          Export Activities
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
