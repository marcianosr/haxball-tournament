import Image from "next/image";
import { Player } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";

type PlayerCardProps = {
  player: Player;
  className?: string;
};

export const PlayerCard = ({ player, className }: PlayerCardProps) => {
  const { name, points, matchesPlayed, wins, losses } = player;
  const [imageError, setImageError] = useState(false);
  
  // Get the correct image source with lowercase filename
  const getImageSrc = (): string => {
    return `/${name.toLowerCase()}.png`;
  };
  
  // Fallback image handling
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px]", className)}>
      <CardHeader className="p-4 pb-0">
        <div className="relative w-full aspect-square rounded-md overflow-hidden mb-2 bg-muted/20">
          {!imageError ? (
            <Image
              src={getImageSrc()}
              alt={`${name}'s profile`}
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
              <span className="text-4xl font-bold text-muted-foreground/50">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold text-center">{name}</h3>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
            <span className="text-muted-foreground text-xs">Points</span>
            <span className="font-semibold text-lg">{points}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
            <span className="text-muted-foreground text-xs">Matches</span>
            <span className="font-semibold text-lg">{matchesPlayed}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
            <span className="text-muted-foreground text-xs">W/L</span>
            <span className="font-semibold text-lg">
              <span className="text-emerald-400/80">{wins}</span>/
              <span className="text-rose-400/70">{losses}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
