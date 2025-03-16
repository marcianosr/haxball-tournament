"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchWithPlayers } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

                console.log("Final match data:", finalData);
                console.log("Semi-finals data:", semiFinalsData);

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
                        console.log("Setting final match:", finalData);
                        setFinal(finalData);
                    } else if (Array.isArray(finalData) && finalData.length > 0 && finalData[0].id) {
                        console.log("Setting final match from array:", finalData[0]);
                        setFinal(finalData[0]);
                    } else {
                        console.log("No valid final match found in data");
                        setFinal(null);
                    }
                } else {
                    console.log("No final match data returned");
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
        return <div>Loading knockout phase data...</div>;
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Knockout Phase Bracket</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bracket">
                    {/* Semi-Finals Round */}
                    <div className="bracket-round">
                        <div className="bracket-matchup">
                            <h3 className="text-sm text-muted-foreground">Semi-Final 1</h3>
                            <Card className={`w-48 ${semifinal1Pending ? "border-amber-500" : ""}`}>
                                <CardContent className="p-4">
                                    <div className={`${semiFinals[0]?.winnerId === semiFinals[0]?.player1Id ? "font-bold" : ""}`}>
                                        {semiFinals[0]?.player1.name}
                                        {semiFinals[0]?.completed && ` (${semiFinals[0]?.player1Score})`}
                                    </div>
                                    <div className="border-t my-2" />
                                    <div className={`${semiFinals[0]?.winnerId === semiFinals[0]?.player2Id ? "font-bold" : ""}`}>
                                        {semiFinals[0]?.player2.name}
                                        {semiFinals[0]?.completed && ` (${semiFinals[0]?.player2Score})`}
                                    </div>
                                    {!semiFinals[0]?.completed && (
                                        <div className="mt-2 text-xs text-amber-600">Match pending</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bracket-matchup">
                            <h3 className="text-sm text-muted-foreground">Semi-Final 2</h3>
                            <Card className={`w-48 ${semifinal2Pending ? "border-amber-500" : ""}`}>
                                <CardContent className="p-4">
                                    <div className={`${semiFinals[1]?.winnerId === semiFinals[1]?.player1Id ? "font-bold" : ""}`}>
                                        {semiFinals[1]?.player1.name}
                                        {semiFinals[1]?.completed && ` (${semiFinals[1]?.player1Score})`}
                                    </div>
                                    <div className="border-t my-2" />
                                    <div className={`${semiFinals[1]?.winnerId === semiFinals[1]?.player2Id ? "font-bold" : ""}`}>
                                        {semiFinals[1]?.player2.name}
                                        {semiFinals[1]?.completed && ` (${semiFinals[1]?.player2Score})`}
                                    </div>
                                    {!semiFinals[1]?.completed && (
                                        <div className="mt-2 text-xs text-amber-600">Match pending</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Connecting lines */}
                    <div className="flex justify-center space-x-24">
                        <div className="flex flex-col items-center">
                            <div className="h-8 w-0.5 bg-primary"></div>
                            <div className="w-20 h-0.5 bg-primary"></div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="h-8 w-0.5 bg-primary"></div>
                            <div className="w-20 h-0.5 bg-primary"></div>
                        </div>
                    </div>

                    {/* Final Round */}
                    <div className="bracket-round">
                        <div className="bracket-matchup">
                            <h3 className="text-sm text-muted-foreground">Final</h3>
                            {areSemiFinalsCompleted && final && final.player1 && final.player2 ? (
                                <Card className={`w-48 ${final && !final.completed ? "border-amber-500" : ""}`}>
                                    <CardContent className="p-4">
                                        <div className={`${final.winnerId === final.player1Id ? "font-bold" : ""}`}>
                                            {final.player1.name}
                                            {final.completed && ` (${final.player1Score})`}
                                        </div>
                                        <div className="border-t my-2" />
                                        <div className={`${final.winnerId === final.player2Id ? "font-bold" : ""}`}>
                                            {final.player2.name}
                                            {final.completed && ` (${final.player2Score})`}
                                        </div>
                                        {!final.completed && (
                                            <div className="mt-2 text-xs text-amber-600">Match pending</div>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="w-48 bg-muted">
                                    <CardContent className="p-4 text-center">
                                        <p className="text-muted-foreground">
                                            {final && !areSemiFinalsCompleted
                                                ? "Semi-finals must be completed first"
                                                : "Not yet determined"}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Champion */}
                    {final && final.completed && final.winnerId && areSemiFinalsCompleted && (
                        <>
                            <div className="h-8 w-0.5 bg-primary mx-auto"></div>
                            <div className="bracket-round">
                                <div className="bracket-matchup">
                                    <h3 className="text-sm text-muted-foreground">Champion</h3>
                                    <Card className="w-48 bg-primary">
                                        <CardContent className="p-4 text-center text-primary-foreground">
                                            <p className="font-bold text-lg">
                                                {final.winnerId === final.player1Id ? final.player1.name : final.player2.name}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Action button for pending matches */}
                    {(semifinal1Pending || semifinal2Pending || (final && !final.completed && areSemiFinalsCompleted)) && (
                        <div className="mt-6 text-center">
                            <p className="mb-2 text-sm text-muted-foreground">
                                There are pending matches that need to be played
                            </p>
                            <Button onClick={handleGoToMatchInput}>
                                Record Match Results
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 