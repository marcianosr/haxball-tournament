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
		<div className="py-12 space-y-16 animate-fade-in">
			{/* Hero section */}
			<section>
				<div className="mx-auto max-w-4xl text-center">
					<div className="mb-8 relative">
						<h1 className="relative z-10 inline-block text-4xl md:text-5xl font-extrabold">
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent animate-shimmer">
								Haxball Tournament
							</span>
						</h1>
						<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary/40 rounded-full blur-sm"></div>
					</div>

					<p className="text-xl mb-12 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						Track tournament progress, view match results, and see the current standings
						in real-time with our modern tournament management platform.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
						<div className="flat-card hover-lift border-glow">
							<div className="mb-4 h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center">
								<Users size={24} className="text-primary" />
							</div>
							<h3 className="text-lg font-semibold mb-2">Group Phase</h3>
							<p className="text-sm text-muted-foreground">
								Round-robin format where all players compete against each other
							</p>
						</div>

						<div className="flat-card hover-lift border-glow">
							<div className="mb-4 h-12 w-12 bg-secondary/20 rounded-xl flex items-center justify-center">
								<Trophy size={24} className="text-secondary" />
							</div>
							<h3 className="text-lg font-semibold mb-2">Knockout</h3>
							<p className="text-sm text-muted-foreground">
								Semi-finals and finals for the top 4 players
							</p>
						</div>

						<div className="flat-card hover-lift border-glow">
							<div className="mb-4 h-12 w-12 bg-accent/20 rounded-xl flex items-center justify-center">
								<Crown size={24} className="text-accent" />
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
				<div className="flat-card glow-sm">
					<h2 className="mb-8 relative">
						Tournament Status
						<span className="absolute -bottom-2 left-0 w-16 h-1 bg-primary/40 rounded-full blur-sm"></span>
					</h2>

					{loading ? (
						<div className="flex flex-col items-center py-12">
							<div className="relative">
								<Loader2 size={40} className="animate-spin text-primary mb-4" />
								<div className="absolute inset-0 rounded-full blur-md bg-primary/10"></div>
							</div>
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
							<div className="border border-white/10 rounded-lg overflow-hidden glass">
								<TournamentStatusDisplay />
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<Button
									className="button-shine h-12 group bg-gradient-to-r from-primary to-primary/90"
									onClick={navigateToCurrentPhase}
								>
									{status.currentPhase === "GROUP" ? "View Group Phase" : "View Knockout Phase"}
									<ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>

								<Button
									variant="outline"
									className="button-shine h-12 group backdrop-blur-sm bg-white/[0.03] border-white/10 hover:bg-white/[0.05]"
									onClick={() => router.push('/admin')}
								>
									Manage Tournament
									<ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
								</Button>
							</div>

							{status.championId && (
								<div className="banner flex flex-col sm:flex-row items-center justify-between">
									<div className="flex items-center">
										<div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mr-4 relative">
											<Crown size={28} className="text-primary animate-pulse-slow" />
											<div className="absolute inset-0 bg-primary/10 rounded-full blur-md -z-10"></div>
										</div>
										<div>
											<p className="text-sm text-primary-foreground/70">Tournament Champion</p>
											<h3 className="text-xl font-bold">{status.championId}</h3>
										</div>
									</div>
									<Button
										variant="secondary"
										className="mt-4 sm:mt-0 button-shine"
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
