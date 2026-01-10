import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Play, 
  Flame, 
  Target, 
  TrendingUp, 
  Dumbbell, 
  Calendar,
  ChevronRight,
  Utensils,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const navigate = useNavigate();
  const [streak] = useState(12);
  const [todayCalories] = useState(1850);
  const [caloriesGoal] = useState(2200);
  const [todayProtein] = useState(120);
  const [proteinGoal] = useState(150);

  const quickStats = [
    { icon: Flame, label: "Streak", value: `${streak} days`, color: "text-orange-500" },
    { icon: Target, label: "Weekly Goal", value: "4/5", color: "text-primary" },
    { icon: TrendingUp, label: "This Week", value: "3.2k lbs", color: "text-green-500" },
  ];

  const recentWorkouts = [
    { name: "Push Day", date: "Yesterday", duration: "52 min", exercises: 6 },
    { name: "Pull Day", date: "2 days ago", duration: "48 min", exercises: 5 },
    { name: "Leg Day", date: "4 days ago", duration: "55 min", exercises: 7 },
  ];

  return (
    <div className="min-h-screen px-4 pt-12 pb-4 animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <p className="text-muted-foreground text-sm font-medium">Good Morning</p>
        <h1 className="text-2xl font-bold mt-1">
          Ready to <span className="gym-gradient-text">Train</span>?
        </h1>
      </header>

      {/* Start Workout CTA */}
      <Button 
        onClick={() => navigate("/routines")}
        className="w-full h-16 text-lg font-bold rounded-2xl gym-glow animate-pulse-glow mb-8 flex items-center justify-center gap-3"
        size="lg"
      >
        <Play className="w-6 h-6" fill="currentColor" />
        Start Workout
      </Button>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
              <span className="text-lg font-bold">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Nutrition */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Today's Nutrition</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/nutrition")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Calories</span>
                <span className="font-medium">{todayCalories} / {caloriesGoal}</span>
              </div>
              <Progress value={(todayCalories / caloriesGoal) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-medium">{todayProtein}g / {proteinGoal}g</span>
              </div>
              <Progress value={(todayProtein / proteinGoal) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Card 
          className="bg-card border-border cursor-pointer hover:bg-muted transition-colors"
          onClick={() => navigate("/exercises")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Exercises</p>
              <p className="text-xs text-muted-foreground">Browse library</p>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-card border-border cursor-pointer hover:bg-muted transition-colors"
          onClick={() => navigate("/leaderboard")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Community</p>
              <p className="text-xs text-muted-foreground">Leaderboard</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Workouts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="text-primary">
            See All
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentWorkouts.map((workout, index) => (
            <Card 
              key={index} 
              className="bg-card border-border cursor-pointer hover:bg-muted transition-colors"
              onClick={() => navigate("/history")}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{workout.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {workout.date} • {workout.duration} • {workout.exercises} exercises
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
