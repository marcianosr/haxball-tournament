import { NextRequest } from 'next/server';
import {
    createPlayer,
    getAllPlayers,
    getPlayerById
} from '@/lib/services/player-service';
import { CreatePlayerInput } from '@/types';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    try {
        if (id) {
            const player = await getPlayerById(id);
            if (!player) {
                return Response.json({ error: 'Player not found' }, { status: 404 });
            }
            return Response.json(player);
        }

        const players = await getAllPlayers();
        return Response.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        return Response.json(
            { error: 'Failed to fetch players' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json() as CreatePlayerInput;

        if (!data.name) {
            return Response.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        const player = await createPlayer(data);
        return Response.json(player, { status: 201 });
    } catch (error) {
        console.error('Error creating player:', error);
        return Response.json(
            { error: 'Failed to create player' },
            { status: 500 }
        );
    }
} 