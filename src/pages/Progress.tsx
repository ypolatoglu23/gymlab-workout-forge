import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Scale, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface WorkoutStats {
  totalWorkouts: number;
  totalVolume: number;
  currentStreak: number;
  avgSessionMinutes: number;
}

interface BodyWeightEntry {
  date: string;
  weight: number;
}

interface PersonalRecord {
  exercise: string;
  weight: string;
  reps: number;
  date: string;
}

export default function Progress() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("strength");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalVolume: 0,
    currentStreak: 0,
    avgSessionMinutes: 0
  });
  const [bodyWeightData, setBodyWeightData] = useState<BodyWeightEntry[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [weightChange, setWeightChange] = useState<number>(0);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProgressData();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const fetchProgressData = async () => {
    if (!user) return;

    try {
      // Fetch all completed workouts
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (workoutsError) throw workoutsError;

      // Fetch exercise logs
      const { data: exerciseLogs, error: logsError } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;

      // Fetch body measurements
      const { data: measurements, error: measurementsError } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: true });

      if (measurementsError) throw measurementsError;

      // Calculate stats
      const totalWorkouts = workouts?.length || 0;
      const totalVolume = (exerciseLogs || []).reduce((sum, log) => {
        return sum + ((log.weight_kg || 0) * (log.reps || 0) * 2.20462); // Convert to lbs
      }, 0);
      const avgSession = totalWorkouts > 0
        ? Math.round((workouts || []).reduce((sum, w) => sum + (w.duration_seconds || 0), 0) / totalWorkouts / 60)
        : 0;

      // Calculate streak
      const streak = calculateStreak(workouts || []);

      setStats({
        totalWorkouts,
        totalVolume: Math.round(totalVolume),
        currentStreak: streak,
        avgSessionMinutes: avgSession
      });

      // Process body weight data
      const weightData = (measurements || [])
        .filter(m => m.weight_kg !== null)
        .map(m => ({
          date: new Date(m.measured_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: Math.round((m.weight_kg || 0) * 2.20462 * 10) / 10 // Convert to lbs
        }));
      setBodyWeightData(weightData);

      if (weightData.length > 0) {
        setLatestWeight(weightData[weightData.length - 1].weight);
        if (weightData.length > 1) {
          setWeightChange(Math.round((weightData[weightData.length - 1].weight - weightData[0].weight) * 10) / 10);
        }
      }

      // Calculate personal records
      const prs = calculatePersonalRecords(exerciseLogs || []);
      setPersonalRecords(prs);

    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreak = (workouts: any[]): number => {
    if (workouts.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const workoutDates = workouts
      .map(w => {
        const date = new Date(w.completed_at);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
      .filter((v, i, a) => a.indexOf(v) === i) // Unique dates
      .sort((a, b) => b - a); // Most recent first

    let streak = 0;
    let checkDate = today.getTime();

    for (const workoutDate of workoutDates) {
      if (workoutDate === checkDate || workoutDate === checkDate - 86400000) {
        streak++;
        checkDate = workoutDate;
      } else if (workoutDate < checkDate - 86400000) {
        break;
      }
    }

    return streak;
  };

  const calculatePersonalRecords = (logs: any[]): PersonalRecord[] => {
    const exerciseMaxes: Record<string, { weight: number; reps: number; date: string }> = {};

    logs.forEach(log => {
      const weightLbs = (log.weight_kg || 0) * 2.20462;
      const exercise = log.exercise_name;

      if (!exerciseMaxes[exercise] || weightLbs > exerciseMaxes[exercise].weight) {
        exerciseMaxes[exercise] = {
          weight: Math.round(weightLbs),
          reps: log.reps || 0,
          date: new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
      }
    });

    return Object.entries(exerciseMaxes)
      .map(([exercise, data]) => ({
        exercise,
        weight: `${data.weight} lbs`,
        reps: data.reps,
        date: data.date
      }))
      .sort((a, b) => parseInt(b.weight) - parseInt(a.weight))
      .slice(0, 5); // Top 5 PRs
  };

  const statsDisplay = [
    { label: "Total Workouts", value: stats.totalWorkouts.toString(), change: "", positive: true },
    { label: "Total Volume", value: stats.totalVolume > 1000 ? `${(stats.totalVolume / 1000).toFixed(1)}k lbs` : `${stats.totalVolume} lbs`, change: "", positive: true },
    { label: "Current Streak", value: `${stats.currentStreak} days`, change: "", positive: true },
    { label: "Avg. Session", value: `${stats.avgSessionMinutes} min`, change: "", positive: true },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen px-4 pt-12 pb-4 animate-fade-in">
        <header className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Progress</h1>
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
          <h1 className="text-2xl font-bold">Progress</h1>
          <p className="text-sm text-muted-foreground">Track your gains</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statsDisplay.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="strength" className="flex-1 gap-2">
            <Dumbbell className="w-4 h-4" />
            Personal Records
          </TabsTrigger>
          <TabsTrigger value="bodyweight" className="flex-1 gap-2">
            <Scale className="w-4 h-4" />
            Body Weight
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strength">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Personal Records</h3>
              {personalRecords.length === 0 ? (
                <div className="text-center py-8">
                  <Dumbbell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No personal records yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete workouts to track your progress!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {personalRecords.map((pr) => (
                    <div key={pr.exercise} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div>
                        <p className="font-medium">{pr.exercise}</p>
                        <p className="text-xs text-muted-foreground">{pr.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{pr.weight}</p>
                        <p className="text-xs text-muted-foreground">x {pr.reps} reps</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bodyweight">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Body Weight (lbs)</h3>
                {latestWeight && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{latestWeight}</p>
                    {weightChange !== 0 && (
                      <p className={`text-xs flex items-center justify-end gap-1 ${weightChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {weightChange < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        {weightChange > 0 ? '+' : ''}{weightChange} lbs
                      </p>
                    )}
                  </div>
                )}
              </div>
              {bodyWeightData.length === 0 ? (
                <div className="text-center py-8">
                  <Scale className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No weight data yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Log your body measurements to track weight changes!
                  </p>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bodyWeightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        domain={['dataMin - 2', 'dataMax + 2']}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary) / 0.2)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
