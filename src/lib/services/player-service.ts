import { prisma } from '@/lib/db';
import { CreatePlayerInput, Player } from '@/types';

export async function getAllPlayers(): Promise<Player[]> {
    return prisma.player.findMany({
        orderBy: {
            points: 'desc',
        },
    });
}

export async function getPlayerById(id: string): Promise<Player | null> {
    return prisma.player.findUnique({
        where: { id },
    });
}

export async function createPlayer(data: CreatePlayerInput): Promise<Player> {
    return prisma.player.create({
        data: {
            name: data.name,
        },
    });
}

export async function getTopPlayers(count: number): Promise<Player[]> {
    return prisma.player.findMany({
        orderBy: {
            points: 'desc',
        },
        take: count,
    });
}

export async function updatePlayerStats(
    playerId: string,
    isWinner: boolean
): Promise<Player> {
    const player = await prisma.player.findUnique({
        where: { id: playerId },
    });

    if (!player) {
        throw new Error(`Player with ID ${playerId} not found`);
    }

    return prisma.player.update({
        where: { id: playerId },
        data: {
            points: isWinner ? player.points + 1 : player.points,
            matchesPlayed: player.matchesPlayed + 1,
            wins: isWinner ? player.wins + 1 : player.wins,
            losses: isWinner ? player.losses : player.losses + 1,
        },
    });
} 