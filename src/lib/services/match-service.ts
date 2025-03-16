import { prisma } from '@/lib/db';
import { CreateMatchInput, Match, MatchWithPlayers, Phase, Round, UpdateMatchScoreInput } from '@/types';
import { updatePlayerStats } from './player-service';

export async function getAllMatches(): Promise<MatchWithPlayers[]> {
    return prisma.match.findMany({
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
        orderBy: {
            completed: 'asc',
        },
    });
}

export async function getMatchById(id: string): Promise<MatchWithPlayers | null> {
    return prisma.match.findUnique({
        where: { id },
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
    });
}

export async function getMatchesByPhase(phase: Phase): Promise<MatchWithPlayers[]> {
    return prisma.match.findMany({
        where: { phase },
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
        orderBy: {
            completed: 'asc',
        },
    });
}

export async function getMatchesByRound(round: Round): Promise<MatchWithPlayers[]> {
    return prisma.match.findMany({
        where: { round },
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
    });
}

export async function createMatch(data: CreateMatchInput): Promise<Match> {
    // Check if match between these players already exists for group phase
    if (data.phase === 'GROUP') {
        const existingMatch = await prisma.match.findFirst({
            where: {
                OR: [
                    {
                        player1Id: data.player1Id,
                        player2Id: data.player2Id,
                        phase: 'GROUP',
                    },
                    {
                        player1Id: data.player2Id,
                        player2Id: data.player1Id,
                        phase: 'GROUP',
                    },
                ],
            },
        });

        if (existingMatch) {
            throw new Error('A match between these players already exists in the group phase');
        }
    }

    return prisma.match.create({
        data: {
            player1Id: data.player1Id,
            player2Id: data.player2Id,
            phase: data.phase as any,
            round: data.round as any,
            completed: false,
        },
    });
}

export async function updateMatchScore(data: UpdateMatchScoreInput): Promise<Match> {
    const match = await prisma.match.findUnique({
        where: { id: data.id },
        include: {
            player1: true,
            player2: true,
        },
    });

    if (!match) {
        throw new Error(`Match with ID ${data.id} not found`);
    }

    if (match.completed) {
        throw new Error('Match is already completed');
    }

    if (data.player1Score === data.player2Score) {
        throw new Error('Scores cannot be equal - there must be a winner');
    }

    // Determine winner
    const winnerId = data.player1Score > data.player2Score ? match.player1Id : match.player2Id;

    // Update player stats
    await updatePlayerStats(match.player1Id, winnerId === match.player1Id);
    await updatePlayerStats(match.player2Id, winnerId === match.player2Id);

    // Update match
    return prisma.match.update({
        where: { id: data.id },
        data: {
            player1Score: data.player1Score,
            player2Score: data.player2Score,
            winnerId: winnerId,
            completed: true,
        },
    });
}

export async function getIncompleteMatchesCount(): Promise<number> {
    return prisma.match.count({
        where: { completed: false },
    });
}

export async function getAllGroupMatches(): Promise<MatchWithPlayers[]> {
    return prisma.match.findMany({
        where: { phase: 'GROUP' },
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
    });
}

export async function getCompletedGroupMatches(): Promise<MatchWithPlayers[]> {
    return prisma.match.findMany({
        where: {
            phase: 'GROUP',
            completed: true
        },
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
    });
}

export async function getIncompleteGroupMatches(): Promise<MatchWithPlayers[]> {
    return prisma.match.findMany({
        where: {
            phase: 'GROUP',
            completed: false
        },
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
    });
}

export async function getKnockoutMatches(): Promise<MatchWithPlayers[]> {
    return prisma.match.findMany({
        where: { phase: 'KNOCKOUT' },
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
    });
}

export async function getSemiFinalsMatches(): Promise<MatchWithPlayers[]> {
    return prisma.match.findMany({
        where: {
            phase: 'KNOCKOUT',
            round: 'SEMI_FINAL'
        },
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
    });
}

export async function getFinalMatch(): Promise<MatchWithPlayers | null> {
    return prisma.match.findFirst({
        where: {
            phase: 'KNOCKOUT',
            round: 'FINAL'
        },
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
    });
} 