import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  Plus, 
  Minus,
  SkipForward,
  Pause,
  Play,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const workoutData = {
  name: "Push Day",
  exercises: [
    {
      id: 1,
      name: "Bench Press",
      sets: [
        { id: 1, weight: 135, reps: 10, completed: false },
        { id: 2, weight: 155, reps: 8, completed: false },
        { id: 3, weight: 175, reps: 6, completed: false },
        { id: 4, weight: 175, reps: 6, completed: false },
      ]
    },
    {
      id: 2,
      name: "Incline Dumbbell Press",
      sets: [
        { id: 1, weight: 50, reps: 10, completed: false },
        { id: 2, weight: 55, reps: 10, completed: false },
        { id: 3, weight: 60, reps: 8, completed: false },
      ]
    },
    {
      id: 3,
      name: "Overhead Press",
      sets: [
        { id: 1, weight: 95, reps: 10, completed: false },
        { id: 2, weight: 105, reps: 8, completed: false },
        { id: 3, weight: 115, reps: 6, completed: false },
      ]
    },
    {
      id: 4,
      name: "Tricep Pushdowns",
      sets: [
        { id: 1, weight: 40, reps: 12, completed: false },
        { id: 2, weight: 45, reps: 12, completed: false },
        { id: 3, weight: 50, reps: 10, completed: false },
      ]
    },
  ]
};

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const { routineId } = useParams();
  const [exercises, setExercises] = useState(workoutData.exercises);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused]);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      const timer = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSetComplete = (exerciseId: number, setId: number) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set => {
            if (set.id === setId) {
              if (!set.completed) {
                setRestTimer(90);
                setIsResting(true);
              }
              return { ...set, completed: !set.completed };
            }
            return set;
          })
        };
      }
      return ex;
    }));
  };

  const updateSetValue = (exerciseId: number, setId: number, field: 'weight' | 'reps', delta: number) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set => {
            if (set.id === setId) {
              return { ...set, [field]: Math.max(0, set[field] + delta) };
            }
            return set;
          })
        };
      }
      return ex;
    }));
  };

  const completedSets = exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  const finishWorkout = () => {
    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold">{workoutData.name}</h1>
              <p className="text-xs text-muted-foreground">
                {completedSets}/{totalSets} sets completed
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-mono font-medium">{formatTime(elapsedTime)}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Rest Timer */}
      {isResting && (
        <div className="sticky top-[60px] z-30 bg-primary text-primary-foreground px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Rest Timer</p>
              <p className="text-2xl font-bold font-mono">{formatTime(restTimer)}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => setRestTimer(prev => prev + 30)}
              >
                +30s
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => { setIsResting(false); setRestTimer(0); }}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Exercises */}
      <div className="px-4 py-6 space-y-6">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="font-bold mb-4">{exercise.name}</h3>
              
              {/* Set Header */}
              <div className="grid grid-cols-12 gap-2 mb-3 text-xs text-muted-foreground font-medium">
                <div className="col-span-1">SET</div>
                <div className="col-span-4 text-center">WEIGHT (lbs)</div>
                <div className="col-span-4 text-center">REPS</div>
                <div className="col-span-3 text-center">✓</div>
              </div>

              {/* Sets */}
              <div className="space-y-3">
                {exercise.sets.map((set) => (
                  <div 
                    key={set.id} 
                    className={`grid grid-cols-12 gap-2 items-center p-2 rounded-lg transition-colors ${
                      set.completed ? 'bg-success/10' : 'bg-secondary/50'
                    }`}
                  >
                    <div className="col-span-1 font-medium text-sm">{set.id}</div>
                    
                    {/* Weight */}
                    <div className="col-span-4 flex items-center justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateSetValue(exercise.id, set.id, 'weight', -5)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input 
                        value={set.weight}
                        className="w-14 h-7 text-center text-sm p-0 bg-background"
                        readOnly
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateSetValue(exercise.id, set.id, 'weight', 5)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {/* Reps */}
                    <div className="col-span-4 flex items-center justify-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateSetValue(exercise.id, set.id, 'reps', -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input 
                        value={set.reps}
                        className="w-12 h-7 text-center text-sm p-0 bg-background"
                        readOnly
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => updateSetValue(exercise.id, set.id, 'reps', 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {/* Checkbox */}
                    <div className="col-span-3 flex justify-center">
                      <Checkbox 
                        checked={set.completed}
                        onCheckedChange={() => toggleSetComplete(exercise.id, set.id)}
                        className="h-6 w-6 rounded-full data-[state=checked]:bg-success data-[state=checked]:border-success"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Set */}
              <Button variant="ghost" size="sm" className="w-full mt-3 text-muted-foreground">
                <Plus className="w-4 h-4 mr-1" />
                Add Set
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add Exercise */}
        <Button variant="outline" className="w-full" onClick={() => navigate("/exercises")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Exercise
        </Button>

        {/* Finish Workout */}
        <Button 
          className="w-full h-14 text-lg font-bold gym-glow"
          onClick={finishWorkout}
          disabled={completedSets === 0}
        >
          <Check className="w-5 h-5 mr-2" />
          Finish Workout
        </Button>
      </div>
    </div>
  );
}
