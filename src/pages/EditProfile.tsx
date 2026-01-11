import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useUnitPreferences } from "@/contexts/UnitPreferencesContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { weightUnit, heightUnit } = useUnitPreferences();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
    height_cm: "",
    weight_kg: "",
    goal_weight_kg: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          username: data.username || "",
          full_name: data.full_name || "",
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
          height_cm: data.height_cm?.toString() || "",
          weight_kg: data.weight_kg?.toString() || "",
          goal_weight_kg: data.goal_weight_kg?.toString() || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username || null,
          full_name: formData.full_name || null,
          bio: formData.bio || null,
          avatar_url: formData.avatar_url || null,
          height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
          weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
          goal_weight_kg: formData.goal_weight_kg ? parseFloat(formData.goal_weight_kg) : null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (formData.full_name) {
      return formData.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (formData.username) {
      return formData.username.slice(0, 2).toUpperCase();
    }
    return "U";
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
        <h1 className="text-lg font-bold">Edit Profile</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSave}
          disabled={saving}
          className="text-primary font-semibold"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </Button>
      </header>

      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <Avatar className="w-24 h-24 ring-2 ring-primary">
            <AvatarImage src={formData.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <Button 
            size="icon" 
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Change Photo</p>
      </div>

      {/* Profile Information */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter your full name"
              className="bg-secondary border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username"
              className="bg-secondary border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="bg-secondary border-border resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input
              id="avatar_url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              className="bg-secondary border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Body Measurements */}
      <Card className="bg-card border-border">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold">Body Measurements</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height_cm">Height ({heightUnit})</Label>
              <Input
                id="height_cm"
                type="number"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                placeholder={heightUnit === 'cm' ? "175" : "5.9"}
                className="bg-secondary border-border"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight_kg">Weight ({weightUnit})</Label>
              <Input
                id="weight_kg"
                type="number"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                placeholder={weightUnit === 'kg' ? "70" : "154"}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal_weight_kg">Goal Weight ({weightUnit})</Label>
            <Input
              id="goal_weight_kg"
              type="number"
              value={formData.goal_weight_kg}
              onChange={(e) => setFormData({ ...formData, goal_weight_kg: e.target.value })}
              placeholder={weightUnit === 'kg' ? "65" : "143"}
              className="bg-secondary border-border"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
