import { useNavigate } from "react-router-dom";
import { Play, Clock, Dumbbell, ChevronRight, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const routines = [
  {
    id: 1,
    name: "Push Day",
    description: "Chest, Shoulders & Triceps",
    exercises: 6,
    duration: "45-55 min",
    color: "from-yellow-500/20 to-orange-500/10",
    lastPerformed: "2 days ago"
  },
  {
    id: 2,
    name: "Pull Day",
    description: "Back & Biceps",
    exercises: 5,
    duration: "40-50 min",
    color: "from-blue-500/20 to-cyan-500/10",
    lastPerformed: "4 days ago"
  },
  {
    id: 3,
    name: "Leg Day",
    description: "Quads, Hamstrings & Glutes",
    exercises: 7,
    duration: "50-60 min",
    color: "from-green-500/20 to-emerald-500/10",
    lastPerformed: "Yesterday"
  },
  {
    id: 4,
    name: "Upper Body",
    description: "Full Upper Body",
    exercises: 8,
    duration: "55-65 min",
    color: "from-purple-500/20 to-pink-500/10",
    lastPerformed: "1 week ago"
  },
  {
    id: 5,
    name: "Lower Body",
    description: "Full Lower Body",
    exercises: 6,
    duration: "45-55 min",
    color: "from-red-500/20 to-orange-500/10",
    lastPerformed: "5 days ago"
  },
];

export default function Routines() {
  const navigate = useNavigate();

  const startWorkout = (routineId: number) => {
    navigate(`/workout/${routineId}`);
  };

  return (
    <div className="min-h-screen px-4 pt-12 pb-4 animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mb-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Workout Routines</h1>
          <p className="text-muted-foreground text-sm">Choose a routine to start</p>
        </div>
        <Button size="icon" variant="secondary" className="rounded-full">
          <Plus className="w-5 h-5" />
        </Button>
      </header>

      {/* Routines List */}
      <div className="space-y-4">
        {routines.map((routine) => (
          <Card 
            key={routine.id}
            className={`bg-gradient-to-br ${routine.color} border-border overflow-hidden`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{routine.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{routine.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Dumbbell className="w-3 h-3" />
                      {routine.exercises} exercises
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {routine.duration}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Last: {routine.lastPerformed}
                  </p>
                </div>
                
                <Button 
                  size="icon" 
                  className="rounded-full h-12 w-12 gym-glow-sm"
                  onClick={() => startWorkout(routine.id)}
                >
                  <Play className="w-5 h-5" fill="currentColor" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State Create Button */}
      <Card className="mt-6 border-dashed border-2 border-border bg-transparent">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-secondary mb-3">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-1">Create Custom Routine</h3>
          <p className="text-sm text-muted-foreground">Build your own workout from scratch</p>
        </CardContent>
      </Card>
    </div>
  );
}
