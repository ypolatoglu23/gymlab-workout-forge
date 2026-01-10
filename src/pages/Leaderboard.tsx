import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Flame, Medal, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const leaderboardData = [
  { rank: 1, name: "Alex Johnson", streak: 45, workouts: 128, avatar: "AJ", points: 12500 },
  { rank: 2, name: "Maria Garcia", streak: 38, workouts: 115, avatar: "MG", points: 11200 },
  { rank: 3, name: "James Wilson", streak: 32, workouts: 98, avatar: "JW", points: 9800 },
  { rank: 4, name: "Sarah Chen", streak: 28, workouts: 92, avatar: "SC", points: 8900 },
  { rank: 5, name: "Mike Brown", streak: 25, workouts: 87, avatar: "MB", points: 8200 },
  { rank: 6, name: "Emily Davis", streak: 22, workouts: 78, avatar: "ED", points: 7500 },
  { rank: 7, name: "You", streak: 12, workouts: 48, avatar: "ME", points: 4800, isCurrentUser: true },
  { rank: 8, name: "Chris Lee", streak: 10, workouts: 45, avatar: "CL", points: 4200 },
  { rank: 9, name: "Lisa Wang", streak: 8, workouts: 38, avatar: "LW", points: 3800 },
  { rank: 10, name: "Tom Miller", streak: 5, workouts: 32, avatar: "TM", points: 3200 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return null;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border-yellow-500/30";
    case 2:
      return "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30";
    case 3:
      return "bg-gradient-to-r from-amber-600/20 to-orange-600/10 border-amber-600/30";
    default:
      return "";
  }
};

export default function Leaderboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 pt-12 pb-4 animate-fade-in">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-sm text-muted-foreground">Compete with others</p>
        </div>
      </header>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-3 mb-8">
        {/* Second Place */}
        <div className="text-center">
          <Avatar className="w-16 h-16 mx-auto mb-2 ring-2 ring-gray-400">
            <AvatarFallback className="bg-gray-400/20">{leaderboardData[1].avatar}</AvatarFallback>
          </Avatar>
          <Medal className="w-5 h-5 mx-auto text-gray-400 mb-1" />
          <p className="text-xs font-medium truncate w-20">{leaderboardData[1].name}</p>
          <p className="text-xs text-muted-foreground">{leaderboardData[1].points} pts</p>
        </div>

        {/* First Place */}
        <div className="text-center -mt-4">
          <div className="relative">
            <Avatar className="w-20 h-20 mx-auto mb-2 ring-4 ring-yellow-500">
              <AvatarFallback className="bg-yellow-500/20 text-lg">{leaderboardData[0].avatar}</AvatarFallback>
            </Avatar>
            <Crown className="w-6 h-6 absolute -top-3 left-1/2 -translate-x-1/2 text-yellow-500" />
          </div>
          <p className="font-bold truncate w-24">{leaderboardData[0].name}</p>
          <p className="text-sm text-primary font-medium">{leaderboardData[0].points} pts</p>
        </div>

        {/* Third Place */}
        <div className="text-center">
          <Avatar className="w-16 h-16 mx-auto mb-2 ring-2 ring-amber-600">
            <AvatarFallback className="bg-amber-600/20">{leaderboardData[2].avatar}</AvatarFallback>
          </Avatar>
          <Medal className="w-5 h-5 mx-auto text-amber-600 mb-1" />
          <p className="text-xs font-medium truncate w-20">{leaderboardData[2].name}</p>
          <p className="text-xs text-muted-foreground">{leaderboardData[2].points} pts</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="streak" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="streak" className="flex-1 gap-2">
            <Flame className="w-4 h-4" />
            Streak
          </TabsTrigger>
          <TabsTrigger value="points" className="flex-1 gap-2">
            <Trophy className="w-4 h-4" />
            Points
          </TabsTrigger>
        </TabsList>

        <TabsContent value="streak" className="space-y-2">
          {leaderboardData.map((user) => (
            <Card 
              key={user.rank} 
              className={`border ${
                user.isCurrentUser 
                  ? 'bg-primary/10 border-primary/30' 
                  : getRankStyle(user.rank) || 'bg-card border-border'
              }`}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-8 text-center">
                  {getRankIcon(user.rank) || (
                    <span className="text-sm font-bold text-muted-foreground">#{user.rank}</span>
                  )}
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={user.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${user.isCurrentUser ? 'text-primary' : ''}`}>
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.workouts} workouts</p>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-bold">{user.streak}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="points" className="space-y-2">
          {leaderboardData.map((user) => (
            <Card 
              key={user.rank} 
              className={`border ${
                user.isCurrentUser 
                  ? 'bg-primary/10 border-primary/30' 
                  : getRankStyle(user.rank) || 'bg-card border-border'
              }`}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="w-8 text-center">
                  {getRankIcon(user.rank) || (
                    <span className="text-sm font-bold text-muted-foreground">#{user.rank}</span>
                  )}
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={user.isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${user.isCurrentUser ? 'text-primary' : ''}`}>
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.workouts} workouts</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">{user.points.toLocaleString()}</span>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
