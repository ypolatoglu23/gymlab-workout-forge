import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Utensils, Droplet, Flame, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const nutritionGoals = {
  calories: 2200,
  protein: 150,
  carbs: 250,
  fats: 70,
  water: 8,
};

interface NutritionEntry {
  id: string;
  food_name: string;
  meal_type: string;
  calories: number;
  protein_g: number | null;
  carbs_g: number | null;
  fats_g: number | null;
  created_at: string;
}

export default function Nutrition() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [meals, setMeals] = useState<NutritionEntry[]>([]);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state for adding meal
  const [newMeal, setNewMeal] = useState({
    food_name: "",
    meal_type: "breakfast",
    calories: "",
    protein_g: "",
    carbs_g: "",
    fats_g: "",
  });

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (user) {
      fetchMeals();
    }
  }, [user]);

  const fetchMeals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("nutrition_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_date", today)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMeals(data || []);
    } catch (error) {
      console.error("Error fetching meals:", error);
      toast({
        title: "Error",
        description: "Failed to load nutrition data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!user || !newMeal.food_name || !newMeal.calories) {
      toast({
        title: "Missing fields",
        description: "Please enter food name and calories",
        variant: "destructive",
      });
      return;
    }

    setIsAddingMeal(true);

    try {
      const { data, error } = await supabase
        .from("nutrition_entries")
        .insert({
          user_id: user.id,
          entry_date: today,
          food_name: newMeal.food_name,
          meal_type: newMeal.meal_type,
          calories: parseInt(newMeal.calories) || 0,
          protein_g: newMeal.protein_g ? parseFloat(newMeal.protein_g) : 0,
          carbs_g: newMeal.carbs_g ? parseFloat(newMeal.carbs_g) : 0,
          fats_g: newMeal.fats_g ? parseFloat(newMeal.fats_g) : 0,
        })
        .select()
        .single();

      if (error) throw error;

      setMeals([...meals, data]);
      setNewMeal({
        food_name: "",
        meal_type: "breakfast",
        calories: "",
        protein_g: "",
        carbs_g: "",
        fats_g: "",
      });
      setDialogOpen(false);

      toast({
        title: "Meal added",
        description: "Your meal has been logged successfully",
      });
    } catch (error) {
      console.error("Error adding meal:", error);
      toast({
        title: "Error",
        description: "Failed to add meal",
        variant: "destructive",
      });
    } finally {
      setIsAddingMeal(false);
    }
  };

  const removeMeal = async (id: string) => {
    try {
      const { error } = await supabase
        .from("nutrition_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMeals(meals.filter((meal) => meal.id !== id));
      toast({
        title: "Meal removed",
        description: "The meal has been deleted",
      });
    } catch (error) {
      console.error("Error removing meal:", error);
      toast({
        title: "Error",
        description: "Failed to remove meal",
        variant: "destructive",
      });
    }
  };

  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein_g || 0), 0);

  const macros = [
    {
      name: "Calories",
      current: totalCalories,
      goal: nutritionGoals.calories,
      icon: Flame,
      color: "text-orange-500",
      unit: "",
    },
    {
      name: "Protein",
      current: Math.round(totalProtein),
      goal: nutritionGoals.protein,
      icon: Cookie,
      color: "text-red-500",
      unit: "g",
    },
    {
      name: "Water",
      current: waterGlasses,
      goal: nutritionGoals.water,
      icon: Droplet,
      color: "text-blue-500",
      unit: " glasses",
    },
  ];

  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snack: "Snack",
    };
    return labels[type] || type;
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
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
        <p className="font-semibold">Today, {format(new Date(), "MMM d")}</p>
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
                    <span className="text-muted-foreground">
                      /{macro.goal}
                      {macro.unit}
                    </span>
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
            <span className="text-sm text-muted-foreground">
              {waterGlasses}/{nutritionGoals.water} glasses
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {Array.from({ length: nutritionGoals.water }).map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className={`w-10 h-10 rounded-full transition-colors ${
                  index < waterGlasses ? "bg-blue-500 text-white" : "bg-secondary"
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="w-4 h-4" />
                Add Meal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Meal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="food_name">Food Name *</Label>
                  <Input
                    id="food_name"
                    placeholder="e.g., Grilled Chicken Salad"
                    value={newMeal.food_name}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, food_name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meal_type">Meal Type</Label>
                  <Select
                    value={newMeal.meal_type}
                    onValueChange={(value) =>
                      setNewMeal({ ...newMeal, meal_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calories">Calories *</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="e.g., 450"
                    value={newMeal.calories}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, calories: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="protein_g">Protein (g)</Label>
                    <Input
                      id="protein_g"
                      type="number"
                      placeholder="0"
                      value={newMeal.protein_g}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, protein_g: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbs_g">Carbs (g)</Label>
                    <Input
                      id="carbs_g"
                      type="number"
                      placeholder="0"
                      value={newMeal.carbs_g}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, carbs_g: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fats_g">Fats (g)</Label>
                    <Input
                      id="fats_g"
                      type="number"
                      placeholder="0"
                      value={newMeal.fats_g}
                      onChange={(e) =>
                        setNewMeal({ ...newMeal, fats_g: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddMeal}
                  className="w-full"
                  disabled={isAddingMeal}
                >
                  {isAddingMeal ? "Adding..." : "Add Meal"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading meals...</p>
            </CardContent>
          </Card>
        ) : (
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
                        <p className="font-medium">{meal.food_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {getMealTypeLabel(meal.meal_type)} • {formatTime(meal.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{meal.calories} kcal</p>
                        <p className="text-xs text-muted-foreground">
                          {meal.protein_g || 0}g protein
                        </p>
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
        )}

        {!isLoading && meals.length === 0 && (
          <Card className="bg-card border-border border-dashed">
            <CardContent className="p-8 text-center">
              <Utensils className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium mb-1">No meals logged</p>
              <p className="text-sm text-muted-foreground">
                Add your first meal to start tracking
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
