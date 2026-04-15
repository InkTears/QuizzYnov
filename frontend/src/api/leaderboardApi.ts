import axios from 'axios';

const API_URL = '/api/leaderboard';

export interface LeaderboardEntry {
    rank: number;
    userId: number;
    userName: string;
    totalScore: number;
    gamesCount: number;
}

export interface LeaderboardResponse {
    weekStart: string;
    weekEnd: string;
    leaderboard: LeaderboardEntry[];
}

export const leaderboardApi = {
    getLeaderboard: async (): Promise<LeaderboardResponse> => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error: unknown) {
            console.error('Erreur lors de la récupération du leaderboard:', error);
            throw error;
        }
    },
};
