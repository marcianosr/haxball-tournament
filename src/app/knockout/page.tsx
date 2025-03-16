"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KnockoutBracketView } from "@/components/tournament/knockout-bracket-view";
import { TournamentStatus } from "@/types";
import { AlertTriangle, Crown, Loader2, Trophy, ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KnockoutPhasePage() {
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

                // Redirect to group page if we're not in knockout phase
                if (data.currentPhase === "GROUP") {
                    router.push("/group");
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
                        <div className="h-10 w-10 bg-secondary/20 rounded-md flex items-center justify-center">
                            <Trophy size={20} className="text-secondary" />
                        </div>
                        <h1 className="side-accent-secondary">Knockout Phase</h1>
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                        The knockout phase features the top 4 players from the group stage
                        competing in semi-finals and finals to determine the tournament champion.
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
                    <Loader2 size={32} className="animate-spin text-secondary mb-4" />
                    <p className="text-muted-foreground">Loading knockout phase data...</p>
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
                <>
                    {status?.championId && (
                        <div className="banner mb-8 flex flex-col sm:flex-row items-center justify-between">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                    <Crown size={24} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-primary-foreground/70">Tournament Champion</p>
                                    <h3 className="text-xl font-bold">{status.championId}</h3>
                                </div>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <div className="status-badge status-success">
                                    Tournament Complete
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flat-card overflow-hidden">
                        <h2 className="px-6 pt-6 pb-4 border-b border-border mb-4">Tournament Bracket</h2>
                        <div className="py-4">
                            <KnockoutBracketView />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 