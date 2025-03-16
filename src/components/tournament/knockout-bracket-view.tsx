"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchWithPlayers } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerCard } from "@/components/player/player-card";

export function KnockoutBracketView() {
    const router = useRouter();
    const [semiFinals, setSemiFinals] = useState<MatchWithPlayers[]>([]);
    const [final, setFinal] = useState<MatchWithPlayers | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                // Use more explicit URLs to ensure we get the correct data
                const [semiFinalsResponse, finalResponse] = await Promise.all([
                    fetch("/api/matches?phase=KNOCKOUT&type=semifinals", {
                        cache: 'no-store',
                        headers: { 'Pragma': 'no-cache' }
                    }),
                    fetch("/api/matches?phase=KNOCKOUT&type=final", {
                        cache: 'no-store',
                        headers: { 'Pragma': 'no-cache' }
                    }),
                ]);

                if (!semiFinalsResponse.ok) {
                    throw new Error(`Failed to fetch semi-finals: ${semiFinalsResponse.statusText}`);
                }

                if (!finalResponse.ok) {
                    throw new Error(`Failed to fetch final: ${finalResponse.statusText}`);
                }

                const semiFinalsData = await semiFinalsResponse.json();
                const finalData = await finalResponse.json();

                // Validate that we got an array for semi-finals
                if (!Array.isArray(semiFinalsData)) {
                    console.error("Semi-finals data is not an array:", semiFinalsData);
                    setSemiFinals([]);
                } else {
                    setSemiFinals(semiFinalsData);
                }

                // Improved check for final match data
                if (finalData && typeof finalData === 'object') {
                    if (finalData.id) {
                        setFinal(finalData);
                    } else if (Array.isArray(finalData) && finalData.length > 0 && finalData[0].id) {
                        setFinal(finalData[0]);
                    } else {
                        setFinal(null);
                    }
                } else {
                    setFinal(null);
                }
            } catch (error) {
                console.error("Error fetching knockout data:", error);
                setError(error instanceof Error ? error.message : "Failed to load knockout data");
            } finally {
                setLoading(false);
            }
        }

        fetchData();

        // Set up polling to refresh data every 5 seconds
        const intervalId = setInterval(fetchData, 5000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Check if semi-finals are completed
    const areSemiFinalsCompleted = semiFinals.length === 2 &&
        semiFinals.every(match => match.completed === true);

    // Check which semifinals need to be played
    const semifinal1Pending = semiFinals[0] && !semiFinals[0].completed;
    const semifinal2Pending = semiFinals[1] && !semiFinals[1].completed;

    const handleGoToMatchInput = () => {
        router.push("/?tab=match-input");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading knockout phase data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error Loading Knockout Phase</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive">{error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (semiFinals.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Knockout Phase</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The knockout phase has not started yet.</p>
                </CardContent>
            </Card>
        );
    }

    // Function to render a match with player cards horizontally
    const renderMatchHorizontal = (
        match: MatchWithPlayers | undefined, 
        title: string
    ) => {
        if (!match) return (
            <div className="match-container">
                <div className="match-title text-sm text-muted-foreground mb-2 text-center">{title}</div>
                <div className="match-empty">
                    <div className="h-28 w-full border border-dashed border-white/20 rounded-md flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">Not yet determined</span>
                    </div>
                </div>
            </div>
        );
        
        return (
            <div className="match-container w-full">
                <div className="match-title text-sm text-muted-foreground mb-2 text-center">{title}</div>
                <div className="flex flex-row items-center gap-4 relative">
                    {/* Player 1 Card */}
                    <div className="relative flex-1">
                        <PlayerCard 
                            player={match.player1} 
                            className={cn(
                                "h-auto",
                                match.completed && match.winnerId === match.player1Id ? "ring-2 ring-emerald-500/30" : ""
                            )}
                        />
                        {match.completed && (
                            <div className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/70">
                                <span className={cn(
                                    "font-bold",
                                    match.winnerId === match.player1Id ? "text-emerald-400" : "text-rose-400"
                                )}>
                                    {match.player1Score}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* VS Indicator */}
                    <div className="z-10 w-10 h-10 rounded-full bg-black/80 flex items-center justify-center border border-white/20 flex-shrink-0">
                        <span className="text-xs font-bold text-white/80">VS</span>
                    </div>
                    
                    {/* Player 2 Card */}
                    <div className="relative flex-1">
                        <PlayerCard 
                            player={match.player2} 
                            className={cn(
                                "h-auto",
                                match.completed && match.winnerId === match.player2Id ? "ring-2 ring-emerald-500/30" : ""
                            )}
                        />
                        {match.completed && (
                            <div className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/70">
                                <span className={cn(
                                    "font-bold",
                                    match.winnerId === match.player2Id ? "text-emerald-400" : "text-rose-400"
                                )}>
                                    {match.player2Score}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* Match Status */}
                    {!match.completed && (
                        <div className="absolute left-0 right-0 bottom-0 p-2 text-xs text-amber-500/80 text-center bg-amber-500/10 border border-amber-500/30 rounded-b-md">
                            Match pending
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Function to render the champion
    const renderChampion = () => {
        if (!final || !final.completed || !final.winnerId) return null;
        
        const champion = final.winnerId === final.player1Id ? final.player1 : final.player2;
        
        return (
            <div className="champion-container mx-auto" style={{ maxWidth: "300px" }}>
                <div className="match-title text-sm text-muted-foreground mb-2 text-center">Champion</div>
                <div className="relative">
                    <PlayerCard 
                        player={champion} 
                        className="h-auto ring-2 ring-amber-500/50"
                    />
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>
                    <div className="absolute top-4 right-4 z-10">
                        <Trophy className="h-6 w-6 text-amber-400" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Knockout Phase Bracket</h2>
            
            <div className="bracket-container">
                <div className="flex flex-col gap-12">
                    {/* Semi-Finals (Top Row) */}
                    <div className="semifinals-row">
                        <h3 className="text-lg font-medium mb-4 text-center">Semi-Finals</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderMatchHorizontal(semiFinals[0], "Semi-Final 1")}
                            {renderMatchHorizontal(semiFinals[1], "Semi-Final 2")}
                        </div>
                    </div>
                    
                    {/* Connector Lines (only visible on desktop) */}
                    <div className="hidden md:block relative h-12">
                        <div className="absolute left-1/4 right-1/4 h-full">
                            <div className="absolute left-0 top-0 w-px h-1/2 bg-white/20"></div>
                            <div className="absolute right-0 top-0 w-px h-1/2 bg-white/20"></div>
                            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/20"></div>
                            <div className="absolute left-1/2 top-1/2 w-px h-1/2 bg-white/20"></div>
                        </div>
                    </div>
                    
                    {/* Final (Bottom Row) */}
                    <div className="final-row">
                        <h3 className="text-lg font-medium mb-4 text-center">Final</h3>
                        <div className="max-w-2xl mx-auto">
                            {areSemiFinalsCompleted && final && final.player1 && final.player2 ? (
                                renderMatchHorizontal(final, "Final")
                            ) : (
                                <div className="match-container">
                                    <div className="match-title text-sm text-muted-foreground mb-2 text-center">Final</div>
                                    <div className="match-empty">
                                        <div className="h-28 w-full border border-dashed border-white/20 rounded-md flex items-center justify-center">
                                            <span className="text-sm text-muted-foreground">
                                                {final && !areSemiFinalsCompleted
                                                    ? "Semi-finals must be completed first"
                                                    : "Not yet determined"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Connector to Champion */}
                    {final && final.completed && final.winnerId && (
                        <div className="relative h-12">
                            <div className="absolute left-1/2 w-px h-full bg-white/20"></div>
                        </div>
                    )}
                    
                    {/* Champion */}
                    {final && final.completed && final.winnerId && (
                        <div className="champion-row">
                            {renderChampion()}
                        </div>
                    )}
                </div>
                
                {/* Action button for pending matches */}
                {(semifinal1Pending || semifinal2Pending || (final && !final.completed && areSemiFinalsCompleted)) && (
                    <div className="mt-12 text-center">
                        <p className="mb-3 text-sm text-muted-foreground">
                            There are pending matches that need to be played
                        </p>
                        <Button onClick={handleGoToMatchInput} className="bg-amber-600 hover:bg-amber-700">
                            Record Match Results
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}