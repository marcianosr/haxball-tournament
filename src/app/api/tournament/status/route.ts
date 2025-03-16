import { NextRequest } from 'next/server';
import { getTournamentStatus } from '@/lib/services/tournament-service';

export async function GET() {
    try {
        const status = await getTournamentStatus();
        return Response.json(status);
    } catch (error) {
        console.error('Error fetching tournament status:', error);
        return Response.json(
            { error: 'Failed to fetch tournament status' },
            { status: 500 }
        );
    }
} 