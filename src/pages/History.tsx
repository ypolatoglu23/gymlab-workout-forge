import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Dumbbell, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface WorkoutHistory {
  id: string;
  date: string;
  name: string;
  duration: number;
  exercises: number;
  volume: number;
  sets: number;
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export default function History() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    if (!authLoading && user) {
      fetchWorkoutHistory();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchWorkoutHistory = async () => {
    if (!user) return;

    try {
      // Fetch workouts
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (workoutsError) throw workoutsError;

      // Fetch exercise logs for each workout to calculate stats
      const workoutIds = workouts?.map(w => w.id) || [];
      
      let exerciseLogs: any[] = [];
      if (workoutIds.length > 0) {
        const { data: logs, error: logsError } = await supabase
          .from('exercise_logs')
          .select('*')
          .eq('user_id', user.id)
          .in('workout_id', workoutIds);

        if (logsError) throw logsError;
        exerciseLogs = logs || [];
      }

      // Map workouts with calculated stats
      const historyData: WorkoutHistory[] = (workouts || []).map(workout => {
        const workoutLogs = exerciseLogs.filter(log => log.workout_id === workout.id);
        const uniqueExercises = new Set(workoutLogs.map(log => log.exercise_name));
        const totalVolume = workoutLogs.reduce((sum, log) => {
          return sum + ((log.weight_kg || 0) * (log.reps || 0) * 2.20462); // Convert kg to lbs for volume
        }, 0);

        return {
          id: workout.id,
          date: workout.completed_at ? new Date(workout.completed_at).toISOString().split('T')[0] : '',
          name: workout.name,
          duration: Math.round((workout.duration_seconds || 0) / 60),
          exercises: uniqueExercises.size,
          volume: Math.round(totalVolume),
          sets: workoutLogs.length
        };
      });

      setWorkoutHistory(historyData);
    } catch (error) {
      console.error('Error fetching workout history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const workoutDates = new Set(workoutHistory.map(w => w.date));

  const navigateMonth = (delta: number) => {
    setCurrentDate(new Date(year, month + delta, 1));
  };

  const isWorkoutDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workoutDates.has(dateStr);
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const hasWorkout = isWorkoutDay(day);
    days.push(
      <div 
        key={day}
        className={`h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
          hasWorkout 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-secondary'
        }`}
      >
        {day}
      </div>
    );
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen px-4 pt-12 pb-4 animate-fade-in">
        <header className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Workout History</h1>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-12 pb-4 animate-fade-in">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Workout History</h1>
          <p className="text-sm text-muted-foreground">Track your progress</p>
        </div>
      </header>

      {/* Calendar */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="font-semibold">{monthNames[month]} {year}</h3>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" />
              <span className="text-xs text-muted-foreground">Workout completed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Workouts */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Workouts</h2>
        {workoutHistory.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No workouts yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your first workout to see it here!
              </p>
              <Button 
                className="mt-4"
                onClick={() => navigate("/active-workout")}
              >
                Start Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {workoutHistory.map((workout) => (
              <Card key={workout.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold">{workout.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workout.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{workout.duration} min</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{workout.sets} sets</p>
                        <p className="text-xs text-muted-foreground">{workout.exercises} exercises</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{(workout.volume / 1000).toFixed(1)}k</p>
                        <p className="text-xs text-muted-foreground">Volume (lbs)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
