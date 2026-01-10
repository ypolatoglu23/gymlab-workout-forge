import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Bell, 
  Moon, 
  Target, 
  HelpCircle, 
  Shield, 
  Trash2,
  ChevronRight,
  LogOut,
  User,
  Lock,
  Globe,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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

export default function Settings() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
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
      onClick: () => toast({ title: "Coming soon", description: "Password change feature will be available soon." })
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

  const appearanceSettings = [
    { 
      icon: Moon, 
      label: "Dark Mode", 
      description: "Use dark theme",
      hasToggle: true,
      checked: darkMode,
      onToggle: setDarkMode
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
            {appearanceSettings.map((item, index) => 
              renderSettingItem(item, index, index === appearanceSettings.length - 1)
            )}
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
