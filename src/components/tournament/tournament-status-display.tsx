"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TournamentStatusWithChampion } from "@/types";

export function TournamentStatusDisplay() {
    const [status, setStatus] = useState<TournamentStatusWithChampion | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStatus() {
            try {
                setLoading(true);
                const response = await fetch("/api/tournament/status");
                const data = await response.json();
                setStatus(data);
            } catch (error) {
                console.error("Error fetching tournament status:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStatus();
        // Auto-refresh interval removed
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tournament Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Loading...</p>
                </CardContent>
            </Card>
        );
    }

    if (!status) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Tournament Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Failed to load tournament status</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tournament Status</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid gap-2">
                    <div className="flex justify-between">
                        <dt className="font-medium">Current Phase:</dt>
                        <dd>{status.currentPhase === "GROUP" ? "Group Phase" : "Knockout Phase"}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="font-medium">Group Phase:</dt>
                        <dd>{status.groupCompleted ? "Completed" : "In Progress"}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="font-medium">Knockout Phase:</dt>
                        <dd>{status.knockoutCreated ? "Started" : "Not Started"}</dd>
                    </div>
                    {status.champion && (
                        <div className="flex justify-between">
                            <dt className="font-medium">Champion:</dt>
                            <dd className="font-bold">{status.champion.name}</dd>
                        </div>
                    )}
                </dl>
            </CardContent>
        </Card>
    );
} 