"use client";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchWithPlayers, Player } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, Trophy, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerCard } from "@/components/player/player-card";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import the Confetti component to avoid SSR issues
const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

// Champion component with confetti effect
type ChampionProps = {
	player: Player;
};

const Champion = ({ player }: ChampionProps) => {
	const championRef = useRef<HTMLDivElement>(null);
	const [confettiDimensions, setConfettiDimensions] = useState({
		width: 0,
		height: 0,
	});

	// Update confetti dimensions when the component mounts or window resizes
	useEffect(() => {
		const updateDimensions = () => {
			if (championRef.current) {
				const { width, height } =
					championRef.current.getBoundingClientRect();
				setConfettiDimensions({
					width: width + 100, // Add some extra width for confetti to spread
					height: height + 100, // Add some extra height for confetti to fall
				});
			}
		};

		// Initial measurement
		updateDimensions();

		// Update on window resize
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	return (
		<div
			className="champion-container mx-auto relative"
			style={{ maxWidth: "300px" }}
			ref={championRef}
		>
			{/* Confetti effect */}
			{confettiDimensions.width > 0 && (
				<div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
					<ReactConfetti
						width={confettiDimensions.width}
						height={confettiDimensions.height}
						recycle={true}
						numberOfPieces={100}
						gravity={0.15}
						colors={[
							"#FFD700",
							"#FFA500",
							"#FF4500",
							"#7FFF00",
							"#00FFFF",
							"#FF00FF",
						]}
						confettiSource={{
							x: 100,
							y: 0,
							w: 0,
							h: 0,
						}}
					/>
				</div>
			)}

			<div className="match-title text-sm text-muted-foreground mb-2 text-center">
				Champion
			</div>
			<div className="relative">
				<PlayerCard
					player={player}
					className="h-auto ring-2 ring-amber-500/50"
				/>
				<div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>
				<div className="absolute top-4 right-4 z-10">
					<Trophy className="h-6 w-6 text-amber-400" />
				</div>
			</div>
		</div>
	);
};

export function KnockoutBracketView() {
	const router = useRouter();
	const [semiFinals, setSemiFinals] = useState<MatchWithPlayers[]>([]);
	const [final, setFinal] = useState<MatchWithPlayers | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				setError(null);

				// Use more explicit URLs to ensure we get the correct data
				const [semiFinalsResponse, finalResponse] = await Promise.all([
					fetch("/api/matches?phase=KNOCKOUT&type=semifinals", {
						cache: "no-store",
						headers: { Pragma: "no-cache" },
					}),
					fetch("/api/matches?phase=KNOCKOUT&type=final", {
						cache: "no-store",
						headers: { Pragma: "no-cache" },
					}),
				]);

				if (!semiFinalsResponse.ok) {
					throw new Error(
						`Failed to fetch semi-finals: ${semiFinalsResponse.statusText}`
					);
				}

				if (!finalResponse.ok) {
					throw new Error(
						`Failed to fetch final: ${finalResponse.statusText}`
					);
				}

				const semiFinalsData = await semiFinalsResponse.json();
				const finalData = await finalResponse.json();

				// Validate that we got an array for semi-finals
				if (!Array.isArray(semiFinalsData)) {
					console.error(
						"Semi-finals data is not an array:",
						semiFinalsData
					);
					setSemiFinals([]);
				} else {
					setSemiFinals(semiFinalsData);
				}

				// Improved check for final match data
				if (finalData && typeof finalData === "object") {
					if (finalData.id) {
						setFinal(finalData);
					} else if (
						Array.isArray(finalData) &&
						finalData.length > 0 &&
						finalData[0].id
					) {
						setFinal(finalData[0]);
					} else {
						setFinal(null);
					}
				} else {
					setFinal(null);
				}
			} catch (error) {
				console.error("Error fetching knockout data:", error);
				setError(
					error instanceof Error
						? error.message
						: "Failed to load knockout data"
				);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	// Check if semi-finals are completed
	const areSemiFinalsCompleted =
		semiFinals.length === 2 &&
		semiFinals.every((match) => match.completed === true);

	// Check which semifinals need to be played
	const semifinal1Pending = semiFinals[0] && !semiFinals[0].completed;
	const semifinal2Pending = semiFinals[1] && !semiFinals[1].completed;

	const handleGoToMatchInput = () => {
		router.push("/?tab=match-input");
	};

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
				<p className="text-muted-foreground">
					Loading knockout phase data...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Error Loading Knockout Phase</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-destructive">{error}</p>
					<Button
						onClick={() => window.location.reload()}
						className="mt-4"
					>
						Retry
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (semiFinals.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Knockout Phase</CardTitle>
				</CardHeader>
				<CardContent>
					<p>The knockout phase has not started yet.</p>
				</CardContent>
			</Card>
		);
	}

	// Function to render a match with player cards horizontally
	const renderMatchHorizontal = (
		match: MatchWithPlayers | undefined,
		title: string
	) => {
		if (!match)
			return (
				<div className="match-container">
					<div className="match-title text-sm text-muted-foreground mb-2 text-center">
						{title}
					</div>
					<div className="match-empty">
						<div className="h-28 w-full border border-dashed border-white/20 rounded-md flex items-center justify-center">
							<span className="text-sm text-muted-foreground">
								Not yet determined
							</span>
						</div>
					</div>
				</div>
			);

		return (
			<div className="match-container w-full">
				<div className="match-title text-xl text-center mb-4">
					{title}
				</div>
				<div className="flex flex-row items-center relative bg-black/20 rounded-lg overflow-hidden">
					{/* Player 1 Card */}
					<div
						className={cn(
							"relative flex-1 p-4",
							match.completed &&
								match.winnerId !== match.player1Id &&
								"opacity-40"
						)}
					>
						<div className="relative aspect-square w-full max-w-[240px] mx-auto mb-4 overflow-hidden rounded-md">
							<Image
								src={`/${match.player1.name.toLowerCase()}.png`}
								alt={match.player1.name}
								className="object-cover object-top"
								fill
								sizes="(max-width: 768px) 100vw, 240px"
								priority
								onError={(e) => {
									// Hide the image and show fallback
									const target = e.target as HTMLImageElement;
									target.style.display = "none";
									// Find the next sibling and remove hidden class
									const parent = target.parentElement;
									if (parent && parent.lastElementChild) {
										(
											parent.lastElementChild as HTMLElement
										).style.display = "flex";
									}
								}}
							/>
							<div
								className="absolute inset-0 items-center justify-center bg-muted/30"
								style={{ display: "none" }}
							>
								<span className="text-4xl font-bold text-muted-foreground/50">
									{match.player1.name.charAt(0)}
								</span>
							</div>
						</div>
						<h3 className="text-2xl font-semibold text-center mb-4">
							{match.player1.name}
						</h3>
						<div className="grid grid-cols-3 gap-2 text-sm">
							<div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
								<span className="text-muted-foreground text-xs">
									Points
								</span>
								<span className="font-semibold text-lg">
									{match.player1.points}
								</span>
							</div>
							<div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
								<span className="text-muted-foreground text-xs">
									Matches
								</span>
								<span className="font-semibold text-lg">
									{match.player1.matchesPlayed}
								</span>
							</div>
							<div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
								<span className="text-muted-foreground text-xs">
									W/L
								</span>
								<span className="font-semibold text-lg">
									<span className="text-emerald-400/80">
										{match.player1.wins}
									</span>
									/
									<span className="text-rose-400/70">
										{match.player1.losses}
									</span>
								</span>
							</div>
						</div>
						{match.completed && (
							<div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/70">
								<span
									className={cn(
										"font-bold",
										match.winnerId === match.player1Id
											? "text-emerald-400"
											: "text-rose-400"
									)}
								>
									{match.player1Score}
								</span>
							</div>
						)}
						{/* Crown for winner */}
						{match.completed &&
							match.winnerId === match.player1Id && (
								<div className="absolute top-4 left-4 z-10">
									<Crown className="h-6 w-6 text-amber-400" />
								</div>
							)}
					</div>

					{/* VS Indicator */}
					<div className="z-10 w-14 h-14 rounded-full bg-black flex items-center justify-center border border-white/20 flex-shrink-0">
						<span className="text-base font-bold text-white">
							VS
						</span>
					</div>

					{/* Player 2 Card */}
					<div
						className={cn(
							"relative flex-1 p-4",
							match.completed &&
								match.winnerId !== match.player2Id &&
								"opacity-40"
						)}
					>
						<div className="relative aspect-square w-full max-w-[240px] mx-auto mb-4 overflow-hidden rounded-md">
							<Image
								src={`/${match.player2.name.toLowerCase()}.png`}
								alt={match.player2.name}
								className="object-cover object-top"
								fill
								sizes="(max-width: 768px) 100vw, 240px"
								priority
								onError={(e) => {
									// Hide the image and show fallback
									const target = e.target as HTMLImageElement;
									target.style.display = "none";
									// Find the next sibling and remove hidden class
									const parent = target.parentElement;
									if (parent && parent.lastElementChild) {
										(
											parent.lastElementChild as HTMLElement
										).style.display = "flex";
									}
								}}
							/>
							<div
								className="absolute inset-0 items-center justify-center bg-muted/30"
								style={{ display: "none" }}
							>
								<span className="text-4xl font-bold text-muted-foreground/50">
									{match.player2.name.charAt(0)}
								</span>
							</div>
						</div>
						<h3 className="text-2xl font-semibold text-center mb-4">
							{match.player2.name}
						</h3>
						<div className="grid grid-cols-3 gap-2 text-sm">
							<div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
								<span className="text-muted-foreground text-xs">
									Points
								</span>
								<span className="font-semibold text-lg">
									{match.player2.points}
								</span>
							</div>
							<div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
								<span className="text-muted-foreground text-xs">
									Matches
								</span>
								<span className="font-semibold text-lg">
									{match.player2.matchesPlayed}
								</span>
							</div>
							<div className="flex flex-col items-center p-2 bg-muted/30 rounded-md">
								<span className="text-muted-foreground text-xs">
									W/L
								</span>
								<span className="font-semibold text-lg">
									<span className="text-emerald-400/80">
										{match.player2.wins}
									</span>
									/
									<span className="text-rose-400/70">
										{match.player2.losses}
									</span>
								</span>
							</div>
						</div>
						{match.completed && (
							<div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/70">
								<span
									className={cn(
										"font-bold",
										match.winnerId === match.player2Id
											? "text-emerald-400"
											: "text-rose-400"
									)}
								>
									{match.player2Score}
								</span>
							</div>
						)}
						{/* Crown for winner */}
						{match.completed &&
							match.winnerId === match.player2Id && (
								<div className="absolute top-4 left-4 z-10">
									<Crown className="h-6 w-6 text-amber-400" />
								</div>
							)}
					</div>

					{/* Match Status */}
				</div>
			</div>
		);
	};

	// Function to render the champion
	const renderChampion = () => {
		if (!final || !final.completed || !final.winnerId) return null;

		const champion =
			final.winnerId === final.player1Id ? final.player1 : final.player2;

		return <Champion player={champion} />;
	};

	return (
		<div className="p-6">
			<h2 className="text-xl font-semibold mb-6">
				Knockout Phase Bracket
			</h2>

			<div className="bracket-container">
				<div className="flex flex-col gap-12">
					{/* Semi-Finals (Top Row) */}
					<div className="semifinals-row">
						<h3 className="text-lg font-medium mb-4 text-center">
							Semi-Finals
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{renderMatchHorizontal(
								semiFinals[0],
								"Semi-Final 1"
							)}
							{renderMatchHorizontal(
								semiFinals[1],
								"Semi-Final 2"
							)}
						</div>
					</div>

					{/* Connector Lines (only visible on desktop) */}
					<div className="hidden md:block relative h-12">
						<div className="absolute left-1/4 right-1/4 h-full">
							<div className="absolute left-0 top-0 w-px h-1/2 bg-white/20"></div>
							<div className="absolute right-0 top-0 w-px h-1/2 bg-white/20"></div>
							<div className="absolute left-0 right-0 top-1/2 h-px bg-white/20"></div>
							<div className="absolute left-1/2 top-1/2 w-px h-1/2 bg-white/20"></div>
						</div>
					</div>

					{/* Final (Bottom Row) */}
					<div className="final-row">
						<h3 className="text-lg font-medium mb-4 text-center">
							Final
						</h3>
						<div className="max-w-2xl mx-auto">
							{areSemiFinalsCompleted &&
							final &&
							final.player1 &&
							final.player2 ? (
								renderMatchHorizontal(final, "Final")
							) : (
								<div className="match-container">
									<div className="match-title text-sm text-muted-foreground mb-2 text-center">
										Final
									</div>
									<div className="match-empty">
										<div className="h-28 w-full border border-dashed border-white/20 rounded-md flex items-center justify-center">
											<span className="text-sm text-muted-foreground">
												{final &&
												!areSemiFinalsCompleted
													? "Semi-finals must be completed first"
													: "Not yet determined"}
											</span>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Connector to Champion */}
					{final && final.completed && final.winnerId && (
						<div className="relative h-12">
							<div className="absolute left-1/2 w-px h-full bg-white/20"></div>
						</div>
					)}

					{/* Champion */}
					{final && final.completed && final.winnerId && (
						<div className="champion-row">{renderChampion()}</div>
					)}
				</div>
			</div>
		</div>
	);
}
