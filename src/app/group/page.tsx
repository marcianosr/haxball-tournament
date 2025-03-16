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
        <div className="animate-fade-in space-y-8">
            <div className="mb-8">
                <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-md">
                            <Users size={22} className="text-primary" />
                        </div>
                        <h1 className="side-accent relative pl-4">
                            Group Phase
                            <span className="absolute -bottom-2 left-4 w-16 h-1 bg-primary/40 rounded-full blur-sm"></span>
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                        In the round-robin group phase, all players compete against each other once.
                        The top 4 players will advance to the knockout phase.
                    </p>
                </div>

                <div className="flex justify-end mb-4">
                    <Button
                        variant="outline"
                        className="h-10 group glass border-white/10 button-shine hover:bg-white/[0.05]"
                        onClick={() => router.push("/admin")}
                    >
                        <Settings size={16} className="mr-2" />
                        Manage Tournament
                        <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flat-card glow-sm flex flex-col items-center py-16">
                    <div className="relative">
                        <Loader2 size={40} className="animate-spin text-primary mb-4" />
                        <div className="absolute inset-0 rounded-full blur-md bg-primary/10"></div>
                    </div>
                    <p className="text-muted-foreground">Loading group phase data...</p>
                </div>
            ) : error ? (
                <div className="flat-card p-6 glow-sm">
                    <div className="banner-secondary flex items-center">
                        <AlertTriangle size={24} className="mr-4 flex-shrink-0" />
                        <div>
                            <h3 className="font-medium mb-1">Error Loading Data</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flat-card glow-sm overflow-hidden">
                    <h2 className="px-6 pt-6 pb-4 border-b border-white/10 mb-0 flex items-center gap-2">
                        Standings
                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/10 ml-2">
                            Round Robin
                        </span>
                    </h2>
                    <div className="glass">
                        <GroupPhaseView />
                    </div>
                </div>
            )}

            {/* Match history section could be added here */}
        </div>
    );
} 