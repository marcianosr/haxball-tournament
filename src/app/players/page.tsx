import { PlayerList } from "@/components/player/player-list";

export default function PlayersPage() {
  return (
    <div className="container py-12 animate-fade-in">
      <div className="mb-8 relative">
        <h1 className="text-3xl md:text-4xl font-bold">
          Tournament Players
        </h1>
        <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary/40 rounded-full blur-sm"></div>
      </div>
      
      <p className="text-muted-foreground mb-8 max-w-2xl">
        View all players participating in the tournament, along with their current statistics.
      </p>
      
      <PlayerList />
    </div>
  );
}
