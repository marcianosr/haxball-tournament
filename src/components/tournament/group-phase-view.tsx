"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MatchWithPlayers, Player } from "@/types";
import { PlayerCard } from "@/components/player/player-card";
import { Loader2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function GroupPhaseView() {
	const [players, setPlayers] = useState<Player[]>([]);
	const [matches, setMatches] = useState<MatchWithPlayers[]>([]);
	const [loading, setLoading] = useState(true);
	const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				const [playersResponse, matchesResponse] = await Promise.all([
					fetch("/api/players"),
					fetch("/api/matches?phase=GROUP"),
				]);

				const playersData = await playersResponse.json();
				const matchesData = await matchesResponse.json();

				setPlayers(playersData);
				setMatches(matchesData);
			} catch (error) {
				console.error("Error fetching group phase data:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	// Handle image error for a specific player
	const handleImageError = (playerId: string) => {
		setImageErrors((prev) => ({
			...prev,
			[playerId]: true,
		}));
	};

	// Get image source for a player
	const getPlayerImageSrc = (name: string): string => {
		return `/${name.toLowerCase()}.png`;
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
				<p className="text-muted-foreground">
					Loading group phase data...
				</p>
			</div>
		);
	}

	// Sort players by points (highest first)
	const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

	// Sort matches by completion status (completed first)
	const sortedMatches = [...matches].sort((a, b) => {
		// Sort by completion status first
		if (a.completed && !b.completed) return -1;
		if (!a.completed && b.completed) return 1;

		// If both have same completion status, sort by ID (assuming newer matches have higher IDs)
		return b.id.localeCompare(a.id);
	});

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
			{/* Player standings (left side - 2/3 width) */}
			<div className="lg:col-span-2 space-y-6">
				<h3 className="text-xl font-semibold">Player Standings</h3>

				{players.length === 0 ? (
					<div className="text-center py-12 text-muted-foreground bg-white/5 rounded-lg">
						No players registered yet
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
						{sortedPlayers.map((player, index) => (
							<div key={player.id} className="relative">
								{/* Rank indicator */}
								<div
									className={cn(
										"absolute -top-3 -left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-md",
										index === 0
											? "bg-yellow-500"
											: index === 1
											? "bg-slate-400"
											: index === 2
											? "bg-amber-700"
											: "bg-primary"
									)}
								>
									{index === 0 ? (
										<Trophy size={16} />
									) : (
										index + 1
									)}
								</div>
								<PlayerCard player={player} />
							</div>
						))}
					</div>
				)}
			</div>

			{/* Match history (right side - 1/3 width) */}
			<div className="space-y-6">
				<h3 className="text-xl font-semibold">Match History</h3>

				<Card className="bg-white/[0.03] border-white/10">
					<CardContent className="p-0">
						{matches.length === 0 ? (
							<div className="text-center py-12 text-muted-foreground">
								No matches generated yet
							</div>
						) : (
							<ul className="divide-y divide-white/10">
								{sortedMatches.map((match) => (
									<li
										key={match.id}
										className={cn(
											"p-4 transition-colors",
											match.completed 
												? "hover:bg-white/[0.02]" 
												: "opacity-60 hover:opacity-80 hover:bg-white/[0.01]"
										)}
									>
										<div className="grid grid-cols-3 items-center">
											{/* Left side - Player 1 */}
											<div className="flex items-center justify-start">
												<div className="relative w-8 h-8 rounded-full overflow-hidden mr-2 bg-muted/20">
													{!imageErrors[
														match.player1Id
													] ? (
														<Image
															src={getPlayerImageSrc(
																match.player1
																	.name
															)}
															alt={
																match.player1
																	.name
															}
															fill
															className="object-cover object-[center_10px] scale-[1.75] translate-y-[-8px]"
															onError={() =>
																handleImageError(
																	match.player1Id
																)
															}
														/>
													) : (
														<div className="absolute inset-0 flex items-center justify-center bg-muted/30">
															<span className="text-xs font-bold text-muted-foreground/50">
																{match.player1.name.charAt(
																	0
																)}
															</span>
														</div>
													)}
												</div>
												<span className="font-medium">
													{match.player1.name}
												</span>
											</div>

											{/* Middle - Score */}
											<div className="flex justify-center items-center">
												{match.completed ? (
													<div className="font-bold text-center">
														<span className={cn(
															match.winnerId === match.player1Id 
																? "text-emerald-400/80" 
																: match.winnerId === match.player2Id 
																	? "text-rose-400/70" 
																	: ""
														)}>
															{match.player1Score}
														</span>
														{" - "}
														<span className={cn(
															match.winnerId === match.player2Id 
																? "text-emerald-400/80" 
																: match.winnerId === match.player1Id 
																	? "text-rose-400/70" 
																	: ""
														)}>
															{match.player2Score}
														</span>
													</div>
												) : (
													<div className="text-xs text-muted-foreground text-center">
														vs
													</div>
												)}
											</div>

											{/* Right side - Player 2 */}
											<div className="flex items-center justify-end">
												<span className="font-medium mr-2">
													{match.player2.name}
												</span>
												<div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted/20">
													{!imageErrors[
														match.player2Id
													] ? (
														<Image
															src={getPlayerImageSrc(
																match.player2
																	.name
															)}
															alt={
																match.player2
																	.name
															}
															fill
															className="object-cover object-[center_10px] scale-[1.75] translate-y-[-8px]"
															onError={() =>
																handleImageError(
																	match.player2Id
																)
															}
														/>
													) : (
														<div className="absolute inset-0 flex items-center justify-center bg-muted/30">
															<span className="text-xs font-bold text-muted-foreground/50">
																{match.player2.name.charAt(
																	0
																)}
															</span>
														</div>
													)}
												</div>
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
