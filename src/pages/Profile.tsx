import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Settings, 
  Edit2, 
  Trophy, 
  Flame, 
  Calendar,
  Scale,
  Ruler,
  Target,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
  ChevronRight,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const userData = {
  name: "Alex Thompson",
  username: "@alexfitness",
  bio: "Fitness enthusiast | Strength training | 💪",
  avatar: "AT",
  joinDate: "Jan 2025",
  stats: {
    workouts: 48,
    streak: 12,
    badges: 8,
  },
  measurements: {
    weight: "173 lbs",
    height: "5'10\"",
    bodyFat: "15%",
    goal: "Build muscle",
  }
};

const settingsItems = [
  { icon: Bell, label: "Notifications", hasToggle: true },
  { icon: Moon, label: "Dark Mode", hasToggle: true, defaultOn: true },
  { icon: Target, label: "Goals & Targets" },
  { icon: HelpCircle, label: "Help & Support" },
];

export default function Profile() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen px-4 pt-12 pb-4 animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Profile</h1>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Profile Card */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 ring-2 ring-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {userData.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground">{userData.username}</p>
                </div>
                <Button size="sm" variant="secondary" className="gap-1">
                  <Edit2 className="w-3 h-3" />
                  Edit
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{userData.bio}</p>
              <p className="text-xs text-muted-foreground mt-2">Member since {userData.joinDate}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold">{userData.stats.workouts}</p>
              <p className="text-xs text-muted-foreground">Workouts</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-xl font-bold">{userData.stats.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">{userData.stats.badges}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Body Measurements */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Body Measurements</h3>
            <Button variant="ghost" size="sm">
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Scale className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="font-medium">{userData.measurements.weight}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Ruler className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="font-medium">{userData.measurements.height}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Body Fat</p>
                <p className="font-medium">{userData.measurements.bodyFat}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Goal</p>
                <p className="font-medium">{userData.measurements.goal}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-2">
          {settingsItems.map((item, index) => (
            <div key={item.label}>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.hasToggle ? (
                  <Switch 
                    checked={item.label === "Notifications" ? notifications : darkMode}
                    onCheckedChange={item.label === "Notifications" ? setNotifications : setDarkMode}
                  />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              {index < settingsItems.length - 1 && <Separator className="mx-3" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Logout */}
      <Button 
        variant="outline" 
        className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
        onClick={() => navigate("/auth")}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-6">
        GYMLAB v1.0.0
      </p>
    </div>
  );
}
