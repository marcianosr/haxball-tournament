"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KnockoutBracketView } from "@/components/tournament/knockout-bracket-view";
import { TournamentStatus } from "@/types";
import {
	AlertTriangle,
	Crown,
	Loader2,
	Trophy,
	ChevronRight,
	Settings,
} from "lucide-react";
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
				setError(
					err instanceof Error
						? err.message
						: "An unknown error occurred"
				);
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
						<div className="h-12 w-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center shadow-md">
							<Trophy size={22} className="text-secondary" />
						</div>
						<h1 className="side-accent-secondary relative pl-4">
							Knockout Phase
							<span className="absolute -bottom-2 left-4 w-16 h-1 bg-secondary/40 rounded-full blur-sm"></span>
						</h1>
					</div>
					<p className="text-muted-foreground max-w-3xl">
						The knockout phase features the top 4 players from the
						group stage competing in semi-finals and finals to
						determine the tournament champion.
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
						<ChevronRight
							size={14}
							className="ml-2 group-hover:translate-x-1 transition-transform"
						/>
					</Button>
				</div>
			</div>

			{loading ? (
				<div className="flat-card glow-sm flex flex-col items-center py-16">
					<div className="relative">
						<Loader2
							size={40}
							className="animate-spin text-secondary mb-4"
						/>
						<div className="absolute inset-0 rounded-full blur-md bg-secondary/10"></div>
					</div>
					<p className="text-muted-foreground">
						Loading knockout phase data...
					</p>
				</div>
			) : error ? (
				<div className="flat-card p-6 glow-sm">
					<div className="banner-secondary flex items-center">
						<AlertTriangle
							size={24}
							className="mr-4 flex-shrink-0"
						/>
						<div>
							<h3 className="font-medium mb-1">
								Error Loading Data
							</h3>
							<p className="text-sm">{error}</p>
						</div>
					</div>
				</div>
			) : (
				<>
					<div className="flat-card glow-sm overflow-hidden">
						<h2 className="px-6 pt-6 pb-4 border-b border-white/10 mb-4 flex items-center gap-2">
							Tournament Bracket
							<span className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary border border-secondary/10 ml-2">
								Semifinals & Finals
							</span>
						</h2>
						<div className="py-4 glass">
							<KnockoutBracketView />
						</div>
					</div>
				</>
			)}
		</div>
	);
}
