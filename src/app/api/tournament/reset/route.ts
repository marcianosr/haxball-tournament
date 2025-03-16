import { NextRequest } from 'next/server';
import { resetTournament } from '@/lib/services/tournament-service';

export async function POST() {
    try {
        await resetTournament();
        return Response.json({
            success: true,
            message: 'Tournament has been reset successfully'
        });
    } catch (error) {
        console.error('Error resetting tournament:', error);
        const message = error instanceof Error ? error.message : 'Failed to reset tournament';
        return Response.json({
            success: false,
            error: message
        }, { status: 500 });
    }
} 