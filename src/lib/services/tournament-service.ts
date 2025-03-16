import { prisma } from '@/lib/db';
import {
    GenerateFinalMatchResponse,
    GenerateSemiFinalMatchesResponse,
    MatchWithPlayers,
    TournamentStatusWithChampion
} from '@/types';
import { getTopPlayers } from './player-service';
import { createMatch, getAllGroupMatches, getIncompleteGroupMatches, getSemiFinalsMatches } from './match-service';

export async function initializeTournamentStatus(): Promise<void> {
    const existingStatus = await prisma.tournamentStatus.findUnique({
        where: { id: 'singleton' },
    });

    if (!existingStatus) {
        await prisma.tournamentStatus.create({
            data: {
                id: 'singleton',
                currentPhase: 'GROUP',
                groupCompleted: false,
                knockoutCreated: false,
            },
        });
    }
}

export async function getTournamentStatus(): Promise<TournamentStatusWithChampion> {
    // Initialize if not exists
    await initializeTournamentStatus();

    const status = await prisma.tournamentStatus.findUnique({
        where: { id: 'singleton' },
    });

    if (!status) {
        throw new Error('Failed to get tournament status');
    }

    let champion = null;
    if (status.championId) {
        champion = await prisma.player.findUnique({
            where: { id: status.championId }
        });
    }

    return {
        ...status,
        champion
    };
}

export async function generateAllGroupMatches(): Promise<MatchWithPlayers[]> {
    // Get all players
    const players = await prisma.player.findMany();

    if (players.length < 2) {
        throw new Error('At least 2 players are required to generate matches');
    }

    // Check if any group matches already exist
    const existingMatches = await getAllGroupMatches();
    if (existingMatches.length > 0) {
        throw new Error('Group matches have already been generated');
    }

    const createdMatches: any[] = [];

    // Generate matches for all player combinations
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            const match = await createMatch({
                player1Id: players[i].id,
                player2Id: players[j].id,
                phase: 'GROUP',
            });

            createdMatches.push({
                ...match,
                player1: players[i],
                player2: players[j],
                winner: null,
            });
        }
    }

    return createdMatches;
}

export async function checkAndCompleteGroupPhase(): Promise<boolean> {
    // Check if there are any incomplete group matches
    const incompleteMatches = await getIncompleteGroupMatches();

    if (incompleteMatches.length > 0) {
        return false; // Group phase is not complete
    }

    // Update tournament status
    await prisma.tournamentStatus.update({
        where: { id: 'singleton' },
        data: {
            groupCompleted: true,
            currentPhase: 'KNOCKOUT'
        },
    });

    return true;
}

export async function generateSemiFinalMatches(): Promise<GenerateSemiFinalMatchesResponse> {
    const status = await getTournamentStatus();

    if (!status.groupCompleted) {
        return {
            success: false,
            message: 'Group phase is not completed yet',
        };
    }

    if (status.knockoutCreated) {
        const existingMatches = await getSemiFinalsMatches();
        return {
            success: false,
            message: 'Semi-final matches have already been generated',
            matches: existingMatches,
        };
    }

    // Get top 4 players
    const topPlayers = await getTopPlayers(4);

    if (topPlayers.length < 4) {
        return {
            success: false,
            message: 'Not enough players to generate semi-finals',
        };
    }

    // Shuffle the top 4 players to create random matchups
    const shuffled = [...topPlayers].sort(() => 0.5 - Math.random());

    // Create semi-final matches
    const match1 = await createMatch({
        player1Id: shuffled[0].id,
        player2Id: shuffled[1].id,
        phase: 'KNOCKOUT',
        round: 'SEMI_FINAL',
    });

    const match2 = await createMatch({
        player1Id: shuffled[2].id,
        player2Id: shuffled[3].id,
        phase: 'KNOCKOUT',
        round: 'SEMI_FINAL',
    });

    // Update tournament status
    await prisma.tournamentStatus.update({
        where: { id: 'singleton' },
        data: { knockoutCreated: true },
    });

    // Get matches with player information
    const semiFinals = await getSemiFinalsMatches();

    return {
        success: true,
        matches: semiFinals,
    };
}

export async function generateFinalMatch(): Promise<GenerateFinalMatchResponse> {
    // Get semi-final matches
    const semiFinals = await getSemiFinalsMatches();
    console.log('Semi-finals for final generation:', semiFinals);

    // Verify both semi-finals are completed
    const incompleteSemiFinals = semiFinals.filter(m => !m.completed);

    if (incompleteSemiFinals.length > 0 || semiFinals.length < 2) {
        return {
            success: false,
            message: 'Both semi-finals must be completed before generating the final',
        };
    }

    // Check if final already exists
    const existingFinal = await prisma.match.findFirst({
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

    if (existingFinal) {
        return {
            success: false,
            message: 'Final match has already been generated',
            match: existingFinal,
        };
    }

    // Get winners from semi-finals
    const semifinal1Winner = semiFinals[0]?.winner;
    const semifinal2Winner = semiFinals[1]?.winner;

    if (!semifinal1Winner || !semifinal2Winner || !semifinal1Winner.id || !semifinal2Winner.id) {
        return {
            success: false,
            message: 'Could not determine winners from semi-finals',
        };
    }

    console.log('Creating final match between:', semifinal1Winner.name || 'unknown', 'and', semifinal2Winner.name || 'unknown');

    // Create final match
    const finalMatch = await createMatch({
        player1Id: semifinal1Winner.id,
        player2Id: semifinal2Winner.id,
        phase: 'KNOCKOUT',
        round: 'FINAL',
    });

    // Get match with player information
    const finalWithPlayers = await prisma.match.findUnique({
        where: { id: finalMatch.id },
        include: {
            player1: true,
            player2: true,
            winner: true,
        },
    });

    if (!finalWithPlayers) {
        return {
            success: false,
            message: 'Failed to create final match',
        };
    }

    return {
        success: true,
        match: finalWithPlayers,
    };
}

export async function completeKnockoutPhase(): Promise<boolean> {
    console.log('Checking if knockout phase is completed');

    // First, verify that a final match exists and is completed
    const final = await prisma.match.findFirst({
        where: {
            phase: 'KNOCKOUT',
            round: 'FINAL',
            completed: true
        },
        include: {
            winner: true
        }
    });

    console.log('Final match status:', final ? `Completed with winner ${final.winner?.name || 'unknown'}` : 'Not completed or not found');

    if (!final || !final.winnerId) {
        console.log('No completed final match found');
        return false;
    }

    // Get the tournament status
    const status = await prisma.tournamentStatus.findUnique({
        where: { id: 'singleton' },
    });

    // Only update if the champion isn't already set
    if (status && !status.championId) {
        console.log('Setting champion ID to:', final.winnerId);

        // Update tournament status to set champion
        await prisma.tournamentStatus.update({
            where: { id: 'singleton' },
            data: { championId: final.winnerId },
        });

        return true;
    }

    return false;
}

export async function resetTournament(): Promise<void> {
    // Delete all matches
    await prisma.match.deleteMany();

    // Reset all player stats
    await prisma.player.updateMany({
        data: {
            points: 0,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
        },
    });

    // Reset tournament status
    await prisma.tournamentStatus.update({
        where: { id: 'singleton' },
        data: {
            currentPhase: 'GROUP',
            groupCompleted: false,
            knockoutCreated: false,
            championId: null,
        },
    });
} 