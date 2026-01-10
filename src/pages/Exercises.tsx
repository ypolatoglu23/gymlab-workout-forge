import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core"];

const exercises = [
  { id: 1, name: "Bench Press", category: "Chest", equipment: "Barbell", muscle: "Pectorals" },
  { id: 2, name: "Incline Dumbbell Press", category: "Chest", equipment: "Dumbbells", muscle: "Upper Chest" },
  { id: 3, name: "Cable Flyes", category: "Chest", equipment: "Cable", muscle: "Pectorals" },
  { id: 4, name: "Pull-ups", category: "Back", equipment: "Bodyweight", muscle: "Lats" },
  { id: 5, name: "Barbell Rows", category: "Back", equipment: "Barbell", muscle: "Upper Back" },
  { id: 6, name: "Lat Pulldown", category: "Back", equipment: "Cable", muscle: "Lats" },
  { id: 7, name: "Overhead Press", category: "Shoulders", equipment: "Barbell", muscle: "Deltoids" },
  { id: 8, name: "Lateral Raises", category: "Shoulders", equipment: "Dumbbells", muscle: "Side Delts" },
  { id: 9, name: "Face Pulls", category: "Shoulders", equipment: "Cable", muscle: "Rear Delts" },
  { id: 10, name: "Bicep Curls", category: "Arms", equipment: "Dumbbells", muscle: "Biceps" },
  { id: 11, name: "Tricep Pushdowns", category: "Arms", equipment: "Cable", muscle: "Triceps" },
  { id: 12, name: "Hammer Curls", category: "Arms", equipment: "Dumbbells", muscle: "Brachialis" },
  { id: 13, name: "Squats", category: "Legs", equipment: "Barbell", muscle: "Quads" },
  { id: 14, name: "Romanian Deadlift", category: "Legs", equipment: "Barbell", muscle: "Hamstrings" },
  { id: 15, name: "Leg Press", category: "Legs", equipment: "Machine", muscle: "Quads" },
  { id: 16, name: "Plank", category: "Core", equipment: "Bodyweight", muscle: "Abs" },
  { id: 17, name: "Cable Crunches", category: "Core", equipment: "Cable", muscle: "Abs" },
];

export default function Exercises() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-4 animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Exercise Library</h1>
            <p className="text-sm text-muted-foreground">{exercises.length} exercises</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-none"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              size="sm"
              className={`rounded-full whitespace-nowrap ${
                selectedCategory === category ? "gym-glow-sm" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </header>

      {/* Exercise List */}
      <div className="px-4 space-y-3">
        {filteredExercises.map((exercise) => (
          <Card 
            key={exercise.id}
            className="bg-card border-border cursor-pointer hover:bg-muted transition-colors"
            onClick={() => navigate(`/exercises/${exercise.id}`)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-xl">💪</span>
                </div>
                <div>
                  <h3 className="font-medium">{exercise.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{exercise.muscle}</Badge>
                    <span className="text-xs text-muted-foreground">{exercise.equipment}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No exercises found</p>
          </div>
        )}
      </div>
    </div>
  );
}
