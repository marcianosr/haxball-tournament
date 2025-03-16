export type Phase = 'GROUP' | 'KNOCKOUT';
export type Round = 'SEMI_FINAL' | 'FINAL';

export interface Player {
    id: string;
    name: string;
    points: number;
    matchesPlayed: number;
    wins: number;
    losses: number;
}

export interface Match {
    id: string;
    player1Id: string;
    player2Id: string;
    player1Score: number | null;
    player2Score: number | null;
    winnerId: string | null;
    phase: Phase;
    round: Round | null;
    completed: boolean;
}

export interface TournamentStatus {
    id: string;
    currentPhase: Phase;
    groupCompleted: boolean;
    knockoutCreated: boolean;
    championId: string | null;
}

export type PlayerWithStats = Player;

export type MatchWithPlayers = Match & {
    player1: Player;
    player2: Player;
    winner: Player | null;
};

export type TournamentStatusWithChampion = TournamentStatus & {
    champion: Player | null;
};

export type CreateMatchInput = {
    player1Id: string;
    player2Id: string;
    phase: Phase;
    round?: Round | null;
};

export type UpdateMatchScoreInput = {
    id: string;
    player1Score: number;
    player2Score: number;
};

export type CreatePlayerInput = {
    name: string;
};

export type GenerateSemiFinalMatchesResponse = {
    success: boolean;
    matches?: MatchWithPlayers[];
    message?: string;
};

export type GenerateFinalMatchResponse = {
    success: boolean;
    match?: MatchWithPlayers;
    message?: string;
}; 