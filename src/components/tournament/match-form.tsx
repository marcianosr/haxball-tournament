"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MatchWithPlayers } from "@/types";

export function MatchForm() {
    const router = useRouter();
    const [matches, setMatches] = useState<MatchWithPlayers[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState("");
    const [player1Score, setPlayer1Score] = useState("");
    const [player2Score, setPlayer2Score] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        async function fetchMatches() {
            try {
                setLoading(true);
                const response = await fetch("/api/matches");
                const data = await response.json();

                // Filter to get only non-completed matches
                const pendingMatches = data.filter((match: MatchWithPlayers) => !match.completed);
                setMatches(pendingMatches);

                if (pendingMatches.length > 0) {
                    setSelectedMatchId(pendingMatches[0].id);
                }
            } catch (error) {
                console.error("Error fetching matches:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMatches();
    }, []);

    const selectedMatch = matches.find(match => match.id === selectedMatchId);

    const handleSubmit = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setSubmitting(true);

            if (!selectedMatchId) {
                setError("Please select a match");
                return;
            }

            const score1 = parseInt(player1Score);
            const score2 = parseInt(player2Score);

            if (isNaN(score1) || isNaN(score2)) {
                setError("Please enter valid scores");
                return;
            }

            if (score1 === score2) {
                setError("Scores cannot be equal - there must be a winner");
                return;
            }

            if (score1 < 0 || score2 < 0) {
                setError("Scores cannot be negative");
                return;
            }

            const response = await fetch("/api/matches/scores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: selectedMatchId,
                    player1Score: score1,
                    player2Score: score2,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || "Failed to update match score");
                return;
            }

            // Success
            setSuccessMessage("Match score recorded successfully!");
            setPlayer1Score("");
            setPlayer2Score("");

            // Refresh matches list
            const updatedMatchesResponse = await fetch("/api/matches");
            const updatedMatchesData = await updatedMatchesResponse.json();
            const pendingMatches = updatedMatchesData.filter((match: MatchWithPlayers) => !match.completed);
            setMatches(pendingMatches);

            if (pendingMatches.length > 0) {
                setSelectedMatchId(pendingMatches[0].id);
            } else {
                setSelectedMatchId("");
            }

            router.refresh();
        } catch (error) {
            console.error("Error submitting match score:", error);
            setError("Failed to submit match score. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Record Match Result</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Loading matches...</p>
                </CardContent>
            </Card>
        );
    }

    if (matches.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Record Match Result</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>There are no pending matches to record.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Record Match Result</CardTitle>
                <CardDescription>
                    Select a match and enter the final scores for both players
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="match-select">Select Match</Label>
                            <Select
                                value={selectedMatchId}
                                onValueChange={setSelectedMatchId}
                            >
                                <SelectTrigger id="match-select">
                                    <SelectValue placeholder="Select a match" />
                                </SelectTrigger>
                                <SelectContent>
                                    {matches.map((match) => (
                                        <SelectItem key={match.id} value={match.id}>
                                            {match.player1.name} vs {match.player2.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedMatch && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="player1-score">{selectedMatch.player1.name} Score</Label>
                                    <Input
                                        id="player1-score"
                                        type="number"
                                        value={player1Score}
                                        onChange={(e) => setPlayer1Score(e.target.value)}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="player2-score">{selectedMatch.player2.name} Score</Label>
                                    <Input
                                        id="player2-score"
                                        type="number"
                                        value={player2Score}
                                        onChange={(e) => setPlayer2Score(e.target.value)}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {error && <p className="text-destructive text-sm">{error}</p>}
                    {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

                    <Button type="submit" disabled={submitting || !selectedMatchId}>
                        {submitting ? "Submitting..." : "Record Result"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 