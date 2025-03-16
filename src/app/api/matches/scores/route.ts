import { NextRequest } from 'next/server';
import { updateMatchScore } from '@/lib/services/match-service';
import { UpdateMatchScoreInput } from '@/types';
import { completeKnockoutPhase, checkAndCompleteGroupPhase } from '@/lib/services/tournament-service';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json() as UpdateMatchScoreInput;

        if (!data.id || data.player1Score === undefined || data.player2Score === undefined) {
            return Response.json(
                { error: 'Match ID and scores are required' },
                { status: 400 }
            );
        }

        if (data.player1Score === data.player2Score) {
            return Response.json(
                { error: 'Scores cannot be equal - there must be a winner' },
                { status: 400 }
            );
        }

        if (data.player1Score < 0 || data.player2Score < 0) {
            return Response.json(
                { error: 'Scores cannot be negative' },
                { status: 400 }
            );
        }

        // Update match score
        const updatedMatch = await updateMatchScore(data);

        // Check if group phase is completed
        await checkAndCompleteGroupPhase();

        // Check if knockout phase is completed
        await completeKnockoutPhase();

        return Response.json(updatedMatch);
    } catch (error) {
        console.error('Error updating match score:', error);
        const message = error instanceof Error ? error.message : 'Failed to update match score';
        return Response.json({ error: message }, { status: 500 });
    }
} 