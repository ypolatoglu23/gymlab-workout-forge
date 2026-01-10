import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Dumbbell, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const workoutHistory = [
  { 
    id: 1, 
    date: "2026-01-09", 
    name: "Push Day", 
    duration: 52, 
    exercises: 6, 
    volume: 12500,
    sets: 18
  },
  { 
    id: 2, 
    date: "2026-01-07", 
    name: "Pull Day", 
    duration: 48, 
    exercises: 5, 
    volume: 10200,
    sets: 15
  },
  { 
    id: 3, 
    date: "2026-01-05", 
    name: "Leg Day", 
    duration: 55, 
    exercises: 7, 
    volume: 18500,
    sets: 21
  },
  { 
    id: 4, 
    date: "2026-01-03", 
    name: "Push Day", 
    duration: 50, 
    exercises: 6, 
    volume: 11800,
    sets: 18
  },
  { 
    id: 5, 
    date: "2026-01-01", 
    name: "Pull Day", 
    duration: 45, 
    exercises: 5, 
    volume: 9800,
    sets: 15
  },
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export default function History() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 10)); // January 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

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
      </section>
    </div>
  );
}
