import { NextRequest } from 'next/server';
import { generateSemiFinalMatches } from '@/lib/services/tournament-service';

export async function POST() {
    try {
        const result = await generateSemiFinalMatches();
        return Response.json(result);
    } catch (error) {
        console.error('Error generating semi-final matches:', error);
        const message = error instanceof Error ? error.message : 'Failed to generate semi-final matches';
        return Response.json({
            success: false,
            error: message
        }, { status: 500 });
    }
} 