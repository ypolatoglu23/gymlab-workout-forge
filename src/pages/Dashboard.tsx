import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, formatDistanceToNow } from "date-fns";

interface Workout {
  id: string;
  name: string;
  created_at: string;
  duration_seconds: number | null;
  completed_at: string | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [streak] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [caloriesGoal] = useState(2200);
  const [todayProtein, setTodayProtein] = useState(0);
  const [proteinGoal] = useState(150);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch recent workouts
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('id, name, created_at, duration_seconds, completed_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (workoutsError) throw workoutsError;
      setRecentWorkouts(workouts || []);

      // Fetch weekly workouts count
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: weeklyCount, error: weeklyError } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneWeekAgo.toISOString());

      if (!weeklyError) {
        setWeeklyWorkouts(weeklyCount || 0);
      }

      // Fetch today's nutrition
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: nutritionData, error: nutritionError } = await supabase
        .from('nutrition_entries')
        .select('calories, protein_g')
        .eq('user_id', user.id)
        .eq('entry_date', today);

      if (!nutritionError && nutritionData) {
        const totalCalories = nutritionData.reduce((sum, entry) => sum + (entry.calories || 0), 0);
        const totalProtein = nutritionData.reduce((sum, entry) => sum + Number(entry.protein_g || 0), 0);
        setTodayCalories(totalCalories);
        setTodayProtein(totalProtein);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0 min";
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatWorkoutDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const quickStats = [
    { icon: Flame, label: "Streak", value: `${streak} days`, color: "text-orange-500" },
    { icon: Target, label: "Weekly Goal", value: `${weeklyWorkouts}/5`, color: "text-primary" },
    { icon: TrendingUp, label: "This Week", value: `${weeklyWorkouts} workouts`, color: "text-green-500" },
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
          {isLoading ? (
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center text-muted-foreground">
                Loading...
              </CardContent>
            </Card>
          ) : recentWorkouts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center text-muted-foreground">
                No workouts yet. Start your first workout!
              </CardContent>
            </Card>
          ) : (
            recentWorkouts.map((workout) => (
              <Card 
                key={workout.id} 
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
                        {formatWorkoutDate(workout.created_at)} • {formatDuration(workout.duration_seconds)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
