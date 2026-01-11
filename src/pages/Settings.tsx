import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Bell, 
  Moon, 
  Sun,
  Target, 
  HelpCircle, 
  Shield, 
  Trash2,
  ChevronRight,
  LogOut,
  User,
  Lock,
  Globe,
  Info,
  Scale,
  Ruler,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUnitPreferences } from "@/contexts/UnitPreferencesContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { weightUnit, heightUnit, setWeightUnit, setHeightUnit } = useUnitPreferences();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  
  // Password change state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast({ 
        title: "Password too short", 
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({ 
        title: "Passwords don't match", 
        description: "Please make sure both passwords are the same.",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    setIsChangingPassword(false);

    if (error) {
      toast({ 
        title: "Failed to change password", 
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({ 
        title: "Password updated", 
        description: "Your password has been changed successfully." 
      });
      setPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleWeightUnitChange = (value: string) => {
    setWeightUnit(value as 'kg' | 'lbs');
    toast({ 
      title: "Weight unit updated", 
      description: `Weight will now be displayed in ${value}.` 
    });
  };

  const handleHeightUnitChange = (value: string) => {
    setHeightUnit(value as 'cm' | 'ft');
    toast({ 
      title: "Height unit updated", 
      description: `Height will now be displayed in ${value === 'ft' ? 'feet/inches' : 'centimeters'}.` 
    });
  };

  const accountSettings = [
    { 
      icon: User, 
      label: "Edit Profile", 
      description: "Update your personal information",
      onClick: () => navigate("/profile/edit")
    },
    { 
      icon: Lock, 
      label: "Change Password", 
      description: "Update your password",
      isPasswordChange: true
    },
    { 
      icon: Globe, 
      label: "Public Profile", 
      description: "Allow others to see your profile",
      hasToggle: true,
      checked: publicProfile,
      onToggle: setPublicProfile
    },
  ];

  const notificationSettings = [
    { 
      icon: Bell, 
      label: "Push Notifications", 
      description: "Receive push notifications",
      hasToggle: true,
      checked: notifications,
      onToggle: setNotifications
    },
    { 
      icon: Target, 
      label: "Workout Reminders", 
      description: "Get reminded to workout",
      hasToggle: true,
      checked: workoutReminders,
      onToggle: setWorkoutReminders
    },
  ];

  const supportSettings = [
    { 
      icon: HelpCircle, 
      label: "Help & Support", 
      description: "Get help with the app",
      onClick: () => toast({ title: "Help Center", description: "Contact support at support@gymlab.app" })
    },
    { 
      icon: Shield, 
      label: "Privacy Policy", 
      description: "Read our privacy policy",
      onClick: () => toast({ title: "Privacy Policy", description: "Opening privacy policy..." })
    },
    { 
      icon: Info, 
      label: "About GYMLAB", 
      description: "Version 1.0.0",
      onClick: () => toast({ title: "GYMLAB", description: "Version 1.0.0 • Built with 💪" })
    },
  ];

  const renderSettingItem = (item: any, index: number, isLast: boolean) => (
    <div key={item.label}>
      {item.isPasswordChange ? (
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-secondary">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your new password below. Password must be at least 6 characters.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setPasswordDialogOpen(false)}
                className="border-border"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePasswordChange}
                disabled={isChangingPassword || !newPassword || !confirmPassword}
                className="bg-primary text-primary-foreground"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <div 
          className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={item.hasToggle ? undefined : item.onClick}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-lg bg-secondary">
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
          {item.hasToggle ? (
            <Switch 
              checked={item.checked}
              onCheckedChange={item.onToggle}
            />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      )}
      {!isLast && <Separator className="mx-3" />}
    </div>
  );

  return (
    <div className="min-h-screen px-4 pt-12 pb-24 animate-fade-in">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Settings</h1>
      </header>

      {/* Account Section */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">ACCOUNT</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-2">
            {accountSettings.map((item, index) => 
              renderSettingItem(item, index, index === accountSettings.length - 1)
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notifications Section */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">NOTIFICATIONS</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-2">
            {notificationSettings.map((item, index) => 
              renderSettingItem(item, index, index === notificationSettings.length - 1)
            )}
          </CardContent>
        </Card>
      </div>

      {/* Appearance Section */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">APPEARANCE</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-2">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-secondary">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Sun className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    {theme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Preferences Section */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">UNIT PREFERENCES</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-2">
            {/* Weight Unit */}
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-secondary">
                  <Scale className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Weight Unit</p>
                  <p className="text-xs text-muted-foreground">Choose your preferred weight unit</p>
                </div>
              </div>
              <Select value={weightUnit} onValueChange={handleWeightUnitChange}>
                <SelectTrigger className="w-24 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="lbs">lbs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator className="mx-3" />
            
            {/* Height Unit */}
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-secondary">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Height Unit</p>
                  <p className="text-xs text-muted-foreground">Choose your preferred height unit</p>
                </div>
              </div>
              <Select value={heightUnit} onValueChange={handleHeightUnitChange}>
                <SelectTrigger className="w-24 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="ft">ft/in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Section */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">SUPPORT</h2>
        <Card className="bg-card border-border">
          <CardContent className="p-2">
            {supportSettings.map((item, index) => 
              renderSettingItem(item, index, index === supportSettings.length - 1)
            )}
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All your data, including workouts, progress, and profile information will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-secondary border-border">Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        {user?.email}
      </p>
    </div>
  );
}
