"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PlayerRegistration } from "@/components/tournament/player-registration";
import { MatchForm } from "@/components/tournament/match-form";
import { TournamentAdminControls } from "@/components/tournament/tournament-admin-controls";
import { TournamentStatusDisplay } from "@/components/tournament/tournament-status-display";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings, Users, ClipboardList, ChevronRight } from "lucide-react";

export default function AdminPage() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState<string>("tournament");
    const router = useRouter();

    useEffect(() => {
        if (tabParam && ['tournament', 'matches', 'players'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-9 w-9 rounded-full glass border-white/10 hover:bg-white/[0.05]"
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
                            <Settings size={22} className="text-white" />
                        </div>
                        <h1 className="side-accent relative pl-4">
                            Administration
                            <span className="absolute -bottom-2 left-4 w-16 h-1 bg-primary/40 rounded-full blur-sm"></span>
                        </h1>
                    </div>
                </div>

                <p className="text-muted-foreground max-w-3xl mb-8">
                    Manage all aspects of the tournament, including player registration,
                    match recording, and tournament progression.
                </p>
            </div>

            {/* Status Cards */}
            <div className="grid gap-6 md:grid-cols-2 mb-12 animate-fade-in delay-100">
                <div className="flat-card glow-sm">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                            <Settings size={16} className="text-primary" />
                        </div>
                        Tournament Status
                    </h3>
                    <div className="border border-white/10 rounded-lg overflow-hidden glass">
                        <TournamentStatusDisplay />
                    </div>
                </div>

                <div className="flat-card glow-sm">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg flex items-center justify-center">
                            <Settings size={16} className="text-secondary" />
                        </div>
                        Tournament Controls
                    </h3>
                    <div className="p-4 border border-white/10 rounded-lg glass">
                        <TournamentAdminControls />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in delay-200">
                <TabsList className="w-full p-1 glass rounded-xl mb-8 border border-white/10">
                    <TabsTrigger
                        value="tournament"
                        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg py-2 px-4"
                    >
                        <Settings size={16} />
                        <span className="font-medium">Tournament</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="matches"
                        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg py-2 px-4"
                    >
                        <ClipboardList size={16} />
                        <span className="font-medium">Record Matches</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="players"
                        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg py-2 px-4"
                    >
                        <Users size={16} />
                        <span className="font-medium">Players</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tournament">
                    <div className="flat-card glow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                                <Settings size={18} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-medium">Tournament Management</h2>
                        </div>

                        <div className="bg-gradient-to-b from-card/80 to-card/60 p-6 rounded-xl border border-white/[0.08] backdrop-blur-sm">
                            <h3 className="text-lg font-medium mb-6 relative inline-block">
                                Management Instructions
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary/30 rounded-full blur-sm"></span>
                            </h3>
                            <ol className="list-decimal pl-5 space-y-4 text-muted-foreground">
                                <li>Register all players using the <Button variant="link" className="px-0 py-0 h-auto text-primary font-medium" onClick={() => setActiveTab("players")}>Players tab <ChevronRight size={14} className="inline" /></Button></li>
                                <li>Generate group phase matches using the "Generate Group Phase Matches" button</li>
                                <li>Record all match results in the <Button variant="link" className="px-0 py-0 h-auto text-primary font-medium" onClick={() => setActiveTab("matches")}>Record Matches tab <ChevronRight size={14} className="inline" /></Button></li>
                                <li>Once all group matches are completed, generate the semi-final matches</li>
                                <li>Record semi-final match results</li>
                                <li>Generate the final match</li>
                                <li>Record the final match result to determine the champion</li>
                            </ol>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="matches">
                    <div className="flat-card glow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center">
                                <ClipboardList size={18} className="text-secondary" />
                            </div>
                            <h2 className="text-xl font-medium">Record Match Results</h2>
                        </div>

                        <div className="glass p-6 rounded-xl border border-white/10">
                            <MatchForm />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="players">
                    <div className="flat-card glow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
                                <Users size={18} className="text-accent" />
                            </div>
                            <h2 className="text-xl font-medium">Player Management</h2>
                        </div>

                        <div className="glass p-6 rounded-xl border border-white/10">
                            <PlayerRegistration />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 