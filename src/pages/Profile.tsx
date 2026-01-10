import { useState, useEffect } from "react";
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
  User,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  goal_weight_kg: number | null;
  created_at: string;
}

interface WorkoutStats {
  totalWorkouts: number;
  currentStreak: number;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<WorkoutStats>({ totalWorkouts: 0, currentStreak: 0 });

  useEffect(() => {
    if (user) {
      fetchProfileAndStats();
    }
  }, [user]);

  const fetchProfileAndStats = async () => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch workout count
      const { count: workoutCount } = await supabase
        .from("workouts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id)
        .not("completed_at", "is", null);

      setStats({
        totalWorkouts: workoutCount || 0,
        currentStreak: 0, // TODO: Calculate actual streak
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (profile?.username) {
      return profile.username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const formatHeight = (cm: number | null) => {
    if (!cm) return "—";
    const feet = Math.floor(cm / 30.48);
    const inches = Math.round((cm % 30.48) / 2.54);
    return `${feet}'${inches}"`;
  };

  const formatWeight = (kg: number | null) => {
    if (!kg) return "—";
    const lbs = Math.round(kg * 2.205);
    return `${lbs} lbs`;
  };

  const getMemberSince = () => {
    if (!profile?.created_at) return "";
    const date = new Date(profile.created_at);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-12 pb-24 animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Profile</h1>
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Profile Card */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 ring-2 ring-primary">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{profile?.full_name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">
                    @{profile?.username || "username"}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="gap-1"
                  onClick={() => navigate("/profile/edit")}
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {profile?.bio || "No bio yet"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Member since {getMemberSince()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold">{stats.totalWorkouts}</p>
              <p className="text-xs text-muted-foreground">Workouts</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-xl font-bold">{stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">0</p>
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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/profile/edit")}
            >
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
                <p className="font-medium">{formatWeight(profile?.weight_kg)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Ruler className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="font-medium">{formatHeight(profile?.height_cm)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Goal Weight</p>
                <p className="font-medium">{formatWeight(profile?.goal_weight_kg)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Goal</p>
                <p className="font-medium">Build muscle</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        GYMLAB v1.0.0
      </p>
    </div>
  );
}
