"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TournamentStatus } from "@/types";
import { TournamentStatusDisplay } from "@/components/tournament/tournament-status-display";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, ChevronRight, Trophy, Users, Crown } from "lucide-react";

export default function Home() {
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
			} catch (err) {
				setError(err instanceof Error ? err.message : "An unknown error occurred");
			} finally {
				setLoading(false);
			}
		}

		fetchTournamentStatus();
	}, []);

	function navigateToCurrentPhase() {
		if (!status) return;

		if (status.currentPhase === "GROUP") {
			router.push("/group");
		} else {
			router.push("/knockout");
		}
	}

	return (
		<div className="py-12 animate-fade-in">
			{/* Hero section */}
			<section className="mb-16">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="mb-6 relative inline-block">
						<span className="font-bold relative z-10">
							Haxball Tournament
							<span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20"></span>
						</span>
					</h1>
					<p className="text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
						Track tournament progress, view match results, and see the current standings
						in real-time with our modern tournament management platform.
					</p>

					<div className="grid grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
						<div className="flat-card hover-lift">
							<div className="mb-4 h-10 w-10 bg-primary/20 rounded-md flex items-center justify-center">
								<Users size={20} className="text-primary" />
							</div>
							<h3 className="text-lg font-semibold mb-2">Group Phase</h3>
							<p className="text-sm text-muted-foreground">
								Round-robin format where all players compete against each other
							</p>
						</div>

						<div className="flat-card hover-lift">
							<div className="mb-4 h-10 w-10 bg-secondary/20 rounded-md flex items-center justify-center">
								<Trophy size={20} className="text-secondary" />
							</div>
							<h3 className="text-lg font-semibold mb-2">Knockout</h3>
							<p className="text-sm text-muted-foreground">
								Semi-finals and finals for the top 4 players
							</p>
						</div>

						<div className="flat-card hover-lift">
							<div className="mb-4 h-10 w-10 bg-accent/20 rounded-md flex items-center justify-center">
								<Crown size={20} className="text-accent" />
							</div>
							<h3 className="text-lg font-semibold mb-2">Champion</h3>
							<p className="text-sm text-muted-foreground">
								The final winner takes the tournament title
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Tournament status section */}
			<section className="max-w-3xl mx-auto">
				<div className="flat-card">
					<h2 className="mb-8">Tournament Status</h2>

					{loading ? (
						<div className="flex flex-col items-center py-12">
							<Loader2 size={32} className="animate-spin text-primary mb-4" />
							<p className="text-muted-foreground">Loading tournament status...</p>
						</div>
					) : error ? (
						<div className="banner-secondary flex items-center p-6">
							<AlertTriangle size={24} className="mr-4" />
							<div>
								<h3 className="font-medium mb-1">Error Loading Status</h3>
								<p className="text-sm">{error}</p>
							</div>
						</div>
					) : status ? (
						<div className="space-y-8">
							<div className="border border-border rounded-lg overflow-hidden">
								<TournamentStatusDisplay />
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<Button
									className="h-12 group"
									onClick={navigateToCurrentPhase}
								>
									{status.currentPhase === "GROUP" ? "View Group Phase" : "View Knockout Phase"}
									<ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>

								<Button
									variant="outline"
									className="h-12 group"
									onClick={() => router.push('/admin')}
								>
									Manage Tournament
									<ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>
							</div>

							{status.championId && (
								<div className="banner flex flex-col sm:flex-row items-center justify-between">
									<div className="flex items-center">
										<div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
											<Crown size={24} className="text-primary" />
										</div>
										<div>
											<p className="text-sm text-primary-foreground/70">Tournament Champion</p>
											<h3 className="text-xl font-bold">{status.championId}</h3>
										</div>
									</div>
									<Button
										variant="secondary"
										className="mt-4 sm:mt-0"
										onClick={() => router.push('/knockout')}
									>
										View Final Results
									</Button>
								</div>
							)}
						</div>
					) : (
						<p className="text-center py-12 text-muted-foreground">No tournament data available</p>
					)}
				</div>
			</section>
		</div>
	);
}
