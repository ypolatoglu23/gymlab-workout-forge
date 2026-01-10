import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Utensils, Droplet, Flame, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

const nutritionGoals = {
  calories: 2200,
  protein: 150,
  carbs: 250,
  fats: 70,
  water: 8,
};

const initialMeals = [
  { id: 1, name: "Breakfast", time: "8:00 AM", calories: 450, protein: 30 },
  { id: 2, name: "Protein Shake", time: "11:00 AM", calories: 200, protein: 25 },
  { id: 3, name: "Lunch", time: "1:00 PM", calories: 650, protein: 40 },
  { id: 4, name: "Pre-Workout Snack", time: "4:00 PM", calories: 250, protein: 15 },
  { id: 5, name: "Dinner", time: "7:30 PM", calories: 550, protein: 35 },
];

export default function Nutrition() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState(initialMeals);
  const [waterGlasses, setWaterGlasses] = useState(5);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);

  const macros = [
    { 
      name: "Calories", 
      current: totalCalories, 
      goal: nutritionGoals.calories, 
      icon: Flame, 
      color: "text-orange-500",
      unit: ""
    },
    { 
      name: "Protein", 
      current: totalProtein, 
      goal: nutritionGoals.protein, 
      icon: Cookie, 
      color: "text-red-500",
      unit: "g"
    },
    { 
      name: "Water", 
      current: waterGlasses, 
      goal: nutritionGoals.water, 
      icon: Droplet, 
      color: "text-blue-500",
      unit: " glasses"
    },
  ];

  const removeMeal = (id: number) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  return (
    <div className="min-h-screen px-4 pt-12 pb-4 animate-fade-in">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nutrition</h1>
          <p className="text-sm text-muted-foreground">Track your daily intake</p>
        </div>
      </header>

      {/* Date Selector */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button variant="ghost" size="sm">←</Button>
        <p className="font-semibold">Today, Jan 10</p>
        <Button variant="ghost" size="sm">→</Button>
      </div>

      {/* Macro Overview */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          <div className="space-y-4">
            {macros.map((macro) => (
              <div key={macro.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <macro.icon className={`w-4 h-4 ${macro.color}`} />
                    <span className="text-sm font-medium">{macro.name}</span>
                  </div>
                  <span className="text-sm">
                    <span className="font-bold">{macro.current}</span>
                    <span className="text-muted-foreground">/{macro.goal}{macro.unit}</span>
                  </span>
                </div>
                <Progress 
                  value={Math.min((macro.current / macro.goal) * 100, 100)} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Water Tracker */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-500" />
              Water Intake
            </h3>
            <span className="text-sm text-muted-foreground">{waterGlasses}/{nutritionGoals.water} glasses</span>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {Array.from({ length: nutritionGoals.water }).map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className={`w-10 h-10 rounded-full transition-colors ${
                  index < waterGlasses ? 'bg-blue-500 text-white' : 'bg-secondary'
                }`}
                onClick={() => setWaterGlasses(index + 1)}
              >
                <Droplet className="w-5 h-5" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meals Log */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Today's Meals</h2>
          <Button size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Add Meal
          </Button>
        </div>

        <div className="space-y-3">
          {meals.map((meal) => (
            <Card key={meal.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Utensils className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">{meal.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{meal.calories} kcal</p>
                      <p className="text-xs text-muted-foreground">{meal.protein}g protein</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeMeal(meal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {meals.length === 0 && (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="p-8 text-center">
              <Utensils className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium mb-1">No meals logged</p>
              <p className="text-sm text-muted-foreground">Add your first meal to start tracking</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
