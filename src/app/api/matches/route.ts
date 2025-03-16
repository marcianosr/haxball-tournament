import { NextRequest } from 'next/server';
import {
    createMatch,
    getAllMatches,
    getCompletedGroupMatches,
    getFinalMatch,
    getIncompleteGroupMatches,
    getKnockoutMatches,
    getMatchById,
    getMatchesByPhase,
    getSemiFinalsMatches
} from '@/lib/services/match-service';
import { CreateMatchInput, Phase } from '@/types';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const phase = searchParams.get('phase') as Phase | null;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    try {
        // Get match by ID
        if (id) {
            const match = await getMatchById(id);
            if (!match) {
                return Response.json({ error: 'Match not found' }, { status: 404 });
            }
            return Response.json(match);
        }

        // Check for specific knockout phase types (semifinals or final)
        if (phase === 'KNOCKOUT' && type) {
            if (type === 'semifinals') {
                console.log('Fetching semifinals matches');
                const matches = await getSemiFinalsMatches();
                return Response.json(matches);
            } else if (type === 'final') {
                console.log('Fetching final match');
                const match = await getFinalMatch();
                // Make sure we return consistent data
                if (match) {
                    // Return the actual match data when it exists
                    console.log("Returning final match:", match);
                    return Response.json(match);
                } else {
                    // Return an empty object if no match exists
                    console.log("No final match found");
                    return Response.json(null);
                }
            }
        }

        // Get matches by phase
        if (phase) {
            console.log(`Fetching all ${phase} phase matches`);
            const matches = await getMatchesByPhase(phase);
            return Response.json(matches);
        }

        // Get group matches by status
        if (phase === 'GROUP' && status) {
            if (status === 'completed') {
                const matches = await getCompletedGroupMatches();
                return Response.json(matches);
            } else if (status === 'incomplete') {
                const matches = await getIncompleteGroupMatches();
                return Response.json(matches);
            }
        }

        // Default: get all matches
        console.log('Fetching all matches');
        const matches = await getAllMatches();
        return Response.json(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        return Response.json(
            { error: 'Failed to fetch matches' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json() as CreateMatchInput;

        if (!data.player1Id || !data.player2Id || !data.phase) {
            return Response.json(
                { error: 'Player IDs and phase are required' },
                { status: 400 }
            );
        }

        if (data.player1Id === data.player2Id) {
            return Response.json(
                { error: 'A player cannot play against themselves' },
                { status: 400 }
            );
        }

        const match = await createMatch(data);
        return Response.json(match, { status: 201 });
    } catch (error) {
        console.error('Error creating match:', error);
        const message = error instanceof Error ? error.message : 'Failed to create match';
        return Response.json({ error: message }, { status: 500 });
    }
} 