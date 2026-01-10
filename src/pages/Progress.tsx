import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Scale, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const strengthData = [
  { date: "Week 1", benchPress: 135, squat: 185, deadlift: 225 },
  { date: "Week 2", benchPress: 140, squat: 195, deadlift: 235 },
  { date: "Week 3", benchPress: 145, squat: 200, deadlift: 245 },
  { date: "Week 4", benchPress: 150, squat: 205, deadlift: 255 },
  { date: "Week 5", benchPress: 155, squat: 215, deadlift: 265 },
  { date: "Week 6", benchPress: 160, squat: 225, deadlift: 275 },
];

const bodyWeightData = [
  { date: "Jan 1", weight: 175 },
  { date: "Jan 3", weight: 174.5 },
  { date: "Jan 5", weight: 174.2 },
  { date: "Jan 7", weight: 173.8 },
  { date: "Jan 9", weight: 173.5 },
  { date: "Jan 10", weight: 173.2 },
];

const stats = [
  { label: "Total Workouts", value: "48", change: "+8", positive: true },
  { label: "Total Volume", value: "245k lbs", change: "+12%", positive: true },
  { label: "Current Streak", value: "12 days", change: "+3", positive: true },
  { label: "Avg. Session", value: "52 min", change: "-3 min", positive: false },
];

export default function Progress() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("strength");

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
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
              <div className={`flex items-center gap-1 text-xs mt-1 ${
                stat.positive ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.positive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="strength" className="flex-1 gap-2">
            <Dumbbell className="w-4 h-4" />
            Strength
          </TabsTrigger>
          <TabsTrigger value="bodyweight" className="flex-1 gap-2">
            <Scale className="w-4 h-4" />
            Body Weight
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strength">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Strength Progress (lbs)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={strengthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
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
                    <Line 
                      type="monotone" 
                      dataKey="benchPress" 
                      stroke="hsl(50, 100%, 50%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(50, 100%, 50%)' }}
                      name="Bench Press"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="squat" 
                      stroke="hsl(142, 76%, 46%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(142, 76%, 46%)' }}
                      name="Squat"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="deadlift" 
                      stroke="hsl(0, 84%, 60%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(0, 84%, 60%)' }}
                      name="Deadlift"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs">Bench Press</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs">Squat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs">Deadlift</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bodyweight">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Body Weight (lbs)</h3>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">173.2</p>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    -1.8 lbs
                  </p>
                </div>
              </div>
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
                      stroke="hsl(50, 100%, 50%)" 
                      fill="hsl(50, 100%, 50%, 0.2)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Personal Records */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Personal Records</h2>
        <div className="space-y-3">
          {[
            { exercise: "Bench Press", weight: "185 lbs", reps: 5, date: "Jan 8, 2026" },
            { exercise: "Squat", weight: "225 lbs", reps: 5, date: "Jan 5, 2026" },
            { exercise: "Deadlift", weight: "275 lbs", reps: 3, date: "Jan 3, 2026" },
          ].map((pr) => (
            <Card key={pr.exercise} className="bg-card border-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{pr.exercise}</p>
                  <p className="text-xs text-muted-foreground">{pr.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{pr.weight}</p>
                  <p className="text-xs text-muted-foreground">x {pr.reps} reps</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
