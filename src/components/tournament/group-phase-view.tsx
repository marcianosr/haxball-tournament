"use client";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchWithPlayers, Player } from "@/types";

export function GroupPhaseView() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [matches, setMatches] = useState<MatchWithPlayers[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [playersResponse, matchesResponse] = await Promise.all([
                    fetch("/api/players"),
                    fetch("/api/matches?phase=GROUP"),
                ]);

                const playersData = await playersResponse.json();
                const matchesData = await matchesResponse.json();

                setPlayers(playersData);
                setMatches(matchesData);
            } catch (error) {
                console.error("Error fetching group phase data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading group phase data...</div>;
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Group Phase Standings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Current standings in the group phase</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Player</TableHead>
                                <TableHead className="text-right">Points</TableHead>
                                <TableHead className="text-right">Matches</TableHead>
                                <TableHead className="text-right">Won</TableHead>
                                <TableHead className="text-right">Lost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        No players registered yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                players
                                    .sort((a, b) => b.points - a.points)
                                    .map((player, index) => (
                                        <TableRow key={player.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="font-medium">{player.name}</TableCell>
                                            <TableCell className="text-right">{player.points}</TableCell>
                                            <TableCell className="text-right">{player.matchesPlayed}</TableCell>
                                            <TableCell className="text-right">{player.wins}</TableCell>
                                            <TableCell className="text-right">{player.losses}</TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Group Phase Matches</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Matches in the group phase</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Player 1</TableHead>
                                <TableHead>Player 2</TableHead>
                                <TableHead className="text-center">Score</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {matches.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No matches generated yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                matches.map((match) => (
                                    <TableRow key={match.id}>
                                        <TableCell className={match.winnerId === match.player1Id ? "font-bold" : ""}>
                                            {match.player1.name}
                                        </TableCell>
                                        <TableCell className={match.winnerId === match.player2Id ? "font-bold" : ""}>
                                            {match.player2.name}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {match.completed
                                                ? `${match.player1Score} - ${match.player2Score}`
                                                : "Not played"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {match.completed ? (
                                                <span className="text-green-600">Completed</span>
                                            ) : (
                                                <span className="text-amber-600">Pending</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
} 