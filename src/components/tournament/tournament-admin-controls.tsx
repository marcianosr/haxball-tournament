"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function TournamentAdminControls() {
	const router = useRouter();
	const [loading, setLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleAction(action: string, endpoint: string) {
		try {
			setLoading(action);
			setError(null);
			const response = await fetch(`/api/tournament/${endpoint}`, {
				method: "POST",
			});

			const data = await response.json();
			console.log(`${action} response:`, data);

			if (!response.ok) {
				// Handle HTTP error responses
				setError(
					data.error ||
						`Failed to ${action.toLowerCase()}: ${
							response.statusText
						}`
				);
				setLoading(null);
				return;
			}

			if (!data.success) {
				// Handle business logic errors
				setError(
					data.error ||
						data.message ||
						`Failed to ${action.toLowerCase()}`
				);
				setLoading(null);
				return;
			} else {
				console.log(`${action} completed successfully:`, data);
			}
		} catch (error) {
			console.error(`Error ${action}:`, error);
			setError(`Failed to ${action.toLowerCase()}. Please try again.`);
		} finally {
			setLoading(null);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Tournament Controls</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="flex flex-col gap-2">
						<Button
							onClick={() =>
								handleAction(
									"Generate Group Matches",
									"generate/group"
								)
							}
							disabled={loading !== null}
							className="w-full"
							size="sm"
						>
							{loading === "Generate Group Matches"
								? "Processing..."
								: "Generate Group Matches"}
						</Button>
						<Button
							onClick={() =>
								handleAction(
									"Generate Semi-Finals",
									"generate/semifinals"
								)
							}
							disabled={loading !== null}
							className="w-full"
							size="sm"
						>
							{loading === "Generate Semi-Finals"
								? "Processing..."
								: "Generate Semi-Finals"}
						</Button>
						<Button
							onClick={() =>
								handleAction("Generate Final", "generate/final")
							}
							disabled={loading !== null}
							className="w-full"
							size="sm"
						>
							{loading === "Generate Final"
								? "Processing..."
								: "Generate Final"}
						</Button>
						<Button
							onClick={() =>
								handleAction("Reset Tournament", "reset")
							}
							disabled={loading !== null}
							variant="destructive"
							className="w-full mt-2"
							size="sm"
						>
							{loading === "Reset Tournament"
								? "Processing..."
								: "Reset Tournament"}
						</Button>
					</div>
					{error && (
						<p className="text-sm text-destructive">{error}</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
