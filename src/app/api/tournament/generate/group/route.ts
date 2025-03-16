import { NextRequest } from 'next/server';
import { generateAllGroupMatches } from '@/lib/services/tournament-service';

export async function POST() {
    try {
        const matches = await generateAllGroupMatches();
        return Response.json({
            success: true,
            matches
        });
    } catch (error) {
        console.error('Error generating group matches:', error);
        const message = error instanceof Error ? error.message : 'Failed to generate group matches';
        return Response.json({
            success: false,
            error: message
        }, { status: 500 });
    }
} 