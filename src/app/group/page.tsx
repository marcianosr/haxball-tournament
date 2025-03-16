"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GroupPhaseView } from "@/components/tournament/group-phase-view";
import { TournamentStatus } from "@/types";
import { AlertTriangle, Loader2, Users, ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GroupPhasePage() {
    const router = useRouter();
    const [status, setStatus] = useState<TournamentStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTournamentStatus() {
            try {
                setLoading(true);
                const response = await fetch("/api/tournament/status");

                if (!response.ok) {
                    throw new Error("Failed to fetch tournament status");
                }

                const data = await response.json();
                setStatus(data);

                // Redirect to knockout page if we're not in group phase
                if (data.currentPhase === "KNOCKOUT") {
                    router.push("/knockout");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchTournamentStatus();
    }, [router]);

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-primary/20 rounded-md flex items-center justify-center">
                            <Users size={20} className="text-primary" />
                        </div>
                        <h1 className="side-accent">Group Phase</h1>
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                        In the round-robin group phase, all players compete against each other once.
                        The top 4 players will advance to the knockout phase.
                    </p>
                </div>

                <div className="flex justify-end mb-4">
                    <Button
                        variant="outline"
                        className="h-10 group"
                        onClick={() => router.push("/admin")}
                    >
                        <Settings size={16} className="mr-2" />
                        Manage Tournament
                        <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flat-card flex flex-col items-center py-16">
                    <Loader2 size={32} className="animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading group phase data...</p>
                </div>
            ) : error ? (
                <div className="flat-card p-6">
                    <div className="banner-secondary flex items-center">
                        <AlertTriangle size={24} className="mr-4 flex-shrink-0" />
                        <div>
                            <h3 className="font-medium mb-1">Error Loading Data</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flat-card overflow-hidden">
                    <h2 className="px-6 pt-6 pb-4 border-b border-border mb-0">Standings</h2>
                    <GroupPhaseView />
                </div>
            )}

            {/* Match history section could be added here */}
        </div>
    );
} 