import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const exerciseData = {
  id: 1,
  name: "Bench Press",
  category: "Chest",
  equipment: "Barbell",
  muscle: "Pectorals",
  secondaryMuscles: ["Triceps", "Anterior Deltoid"],
  instructions: [
    "Lie flat on the bench with your feet firmly planted on the ground.",
    "Grip the barbell slightly wider than shoulder-width apart.",
    "Unrack the bar and position it directly above your chest with arms fully extended.",
    "Lower the bar slowly to your mid-chest, keeping your elbows at about 45 degrees.",
    "Push the bar back up to the starting position, exhaling as you press.",
    "Keep your back slightly arched and your shoulder blades squeezed together throughout the movement."
  ],
  tips: [
    "Keep your wrists straight to avoid injury",
    "Don't bounce the bar off your chest",
    "Focus on controlled movements",
    "Use a spotter for heavy lifts"
  ],
  personalRecord: "225 lbs x 5 reps",
  lastPerformed: "2 days ago"
};

export default function ExerciseDetail() {
  const navigate = useNavigate();
  const { exerciseId } = useParams();

  return (
    <div className="min-h-screen pb-24 animate-fade-in">
      {/* Header with Image */}
      <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-12 left-4 bg-background/20 backdrop-blur-sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        {/* Placeholder for exercise image/video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl">🏋️</span>
            <p className="text-sm text-muted-foreground mt-2">Exercise demo</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10">
        {/* Title Card */}
        <Card className="bg-card border-border mb-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{exerciseData.name}</h1>
                <div className="flex flex-wrap gap-2">
                  <Badge>{exerciseData.category}</Badge>
                  <Badge variant="secondary">{exerciseData.equipment}</Badge>
                  <Badge variant="outline">{exerciseData.muscle}</Badge>
                </div>
              </div>
              <Button size="icon" variant="secondary" className="rounded-full">
                <Play className="w-5 h-5" />
              </Button>
            </div>

            {/* Secondary Muscles */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Also targets:</p>
              <p className="text-sm font-medium">{exerciseData.secondaryMuscles.join(", ")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Personal Stats */}
        <Card className="bg-card border-border mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Your Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Personal Record</p>
                <p className="font-bold text-lg text-primary">{exerciseData.personalRecord}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Performed</p>
                <p className="font-medium">{exerciseData.lastPerformed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-card border-border mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">How to Perform</h3>
            <ol className="space-y-3">
              {exerciseData.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{instruction}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2">
              {exerciseData.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-lg border-t border-border">
        <Button className="w-full h-12 font-bold gym-glow">
          <Plus className="w-5 h-5 mr-2" />
          Add to Workout
        </Button>
      </div>
    </div>
  );
}
