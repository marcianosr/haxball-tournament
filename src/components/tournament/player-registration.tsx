"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Player } from "@/types";

export function PlayerRegistration() {
    const router = useRouter();
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        async function fetchPlayers() {
            try {
                setLoading(true);
                const response = await fetch("/api/players");
                const data = await response.json();
                setPlayers(data);
            } catch (error) {
                console.error("Error fetching players:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPlayers();
    }, []);

    const handleSubmit = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setSubmitting(true);

            if (!playerName.trim()) {
                setError("Please enter a player name");
                return;
            }

            const response = await fetch("/api/players", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: playerName.trim(),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || "Failed to register player");
                return;
            }

            // Success
            const newPlayer = await response.json();
            setSuccessMessage(`Player "${newPlayer.name}" registered successfully!`);
            setPlayerName("");
            setPlayers([...players, newPlayer]);
            router.refresh();
        } catch (error) {
            console.error("Error registering player:", error);
            setError("Failed to register player. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Register Player</CardTitle>
                    <CardDescription>
                        Add new players to the tournament
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="player-name">Player Name</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="player-name"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    placeholder="Enter player name"
                                    required
                                />
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? "Registering..." : "Register"}
                                </Button>
                            </div>
                        </div>

                        {error && <p className="text-destructive text-sm">{error}</p>}
                        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Registered Players</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading players...</p>
                    ) : (
                        <Table>
                            <TableCaption>List of registered players</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Points</TableHead>
                                    <TableHead className="text-right">Matches Played</TableHead>
                                    <TableHead className="text-right">Win/Loss</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No players registered yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    players.map((player) => (
                                        <TableRow key={player.id}>
                                            <TableCell className="font-medium">{player.name}</TableCell>
                                            <TableCell className="text-right">{player.points}</TableCell>
                                            <TableCell className="text-right">{player.matchesPlayed}</TableCell>
                                            <TableCell className="text-right">
                                                {player.wins}/{player.losses}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 