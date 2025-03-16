"use client";

import { useState, useEffect } from "react";
import { Player } from "@/types";
import { PlayerCard } from "@/components/player/player-card";
import { Loader2, AlertTriangle } from "lucide-react";

type PlayerListProps = {
  className?: string;
};

export const PlayerList = ({ className }: PlayerListProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/players");
        
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        
        const data = await response.json();
        setPlayers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading players...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-6 flex items-center">
        <AlertTriangle className="h-6 w-6 text-destructive mr-4" />
        <div>
          <h3 className="font-medium">Error Loading Players</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No players found</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};
