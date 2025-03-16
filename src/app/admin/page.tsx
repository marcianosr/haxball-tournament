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
        <div className="animate-fade-in">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-8 w-8"
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-primary/20 rounded-md flex items-center justify-center">
                            <Settings size={20} className="text-primary" />
                        </div>
                        <h1 className="side-accent">Administration</h1>
                    </div>
                </div>

                <p className="text-muted-foreground max-w-3xl mb-8">
                    Manage all aspects of the tournament, including player registration,
                    match recording, and tournament progression.
                </p>
            </div>

            {/* Status Cards */}
            <div className="grid gap-6 md:grid-cols-2 mb-10 animate-fade-in delay-100">
                <div className="flat-card">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <div className="h-6 w-6 bg-primary/20 rounded-sm flex items-center justify-center">
                            <Settings size={14} className="text-primary" />
                        </div>
                        Tournament Status
                    </h3>
                    <div className="border border-border rounded-lg overflow-hidden">
                        <TournamentStatusDisplay />
                    </div>
                </div>

                <div className="flat-card">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <div className="h-6 w-6 bg-secondary/20 rounded-sm flex items-center justify-center">
                            <Settings size={14} className="text-secondary" />
                        </div>
                        Tournament Controls
                    </h3>
                    <div className="p-4 border border-border rounded-lg">
                        <TournamentAdminControls />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in delay-200">
                <TabsList className="w-full p-1 bg-card rounded-lg mb-6">
                    <TabsTrigger
                        value="tournament"
                        className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md py-2"
                    >
                        <Settings size={16} />
                        <span>Tournament</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="matches"
                        className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md py-2"
                    >
                        <ClipboardList size={16} />
                        <span>Record Matches</span>
                    </TabsTrigger>

                    <TabsTrigger
                        value="players"
                        className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md py-2"
                    >
                        <Users size={16} />
                        <span>Players</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tournament">
                    <div className="flat-card">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-8 bg-primary/20 rounded-md flex items-center justify-center">
                                <Settings size={16} className="text-primary" />
                            </div>
                            <h2 className="text-xl font-medium">Tournament Management</h2>
                        </div>

                        <div className="bg-card p-6 rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Management Instructions</h3>
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
                    <div className="flat-card">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-8 bg-secondary/20 rounded-md flex items-center justify-center">
                                <ClipboardList size={16} className="text-secondary" />
                            </div>
                            <h2 className="text-xl font-medium">Record Match Results</h2>
                        </div>

                        <div className="bg-card p-4 rounded-lg border border-border">
                            <MatchForm />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="players">
                    <div className="flat-card">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-8 bg-accent/20 rounded-md flex items-center justify-center">
                                <Users size={16} className="text-accent" />
                            </div>
                            <h2 className="text-xl font-medium">Player Management</h2>
                        </div>

                        <div className="bg-card p-4 rounded-lg border border-border">
                            <PlayerRegistration />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 