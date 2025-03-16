"use client";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupPhaseView } from "@/components/tournament/group-phase-view";
import { KnockoutBracketView } from "@/components/tournament/knockout-bracket-view";
import { TournamentAdminControls } from "@/components/tournament/tournament-admin-controls";
import { TournamentStatusDisplay } from "@/components/tournament/tournament-status-display";
import { MatchForm } from "@/components/tournament/match-form";
import { PlayerRegistration } from "@/components/tournament/player-registration";
import { useEffect, useState } from "react";

export default function Home() {
	const searchParams = useSearchParams();
	const tabParam = searchParams.get('tab');
	const [activeTab, setActiveTab] = useState<string>("group-phase");

	useEffect(() => {
		if (tabParam && ['group-phase', 'knockout', 'match-input', 'registration'].includes(tabParam)) {
			setActiveTab(tabParam);
		}
	}, [tabParam]);

	return (
		<div className="space-y-8">
			<div className="grid gap-4 md:grid-cols-2">
				<TournamentStatusDisplay />
				<TournamentAdminControls />
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="group-phase">Group Phase</TabsTrigger>
					<TabsTrigger value="knockout">Knockout Phase</TabsTrigger>
					<TabsTrigger value="match-input">Record Match</TabsTrigger>
					<TabsTrigger value="registration">Players</TabsTrigger>
				</TabsList>
				<TabsContent value="group-phase" className="py-4">
					<GroupPhaseView />
				</TabsContent>
				<TabsContent value="knockout" className="py-4">
					<KnockoutBracketView />
				</TabsContent>
				<TabsContent value="match-input" className="py-4">
					<MatchForm />
				</TabsContent>
				<TabsContent value="registration" className="py-4">
					<PlayerRegistration />
				</TabsContent>
			</Tabs>
		</div>
	);
}
