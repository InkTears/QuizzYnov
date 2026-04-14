import axios from 'axios';
import type { PlayerSession } from '../types/Profile';

const API_URL = '/api/quiz/sessions/me';

export const profileApi = {
  getMySessions: async (token: string) => {
    const response = await axios.get<PlayerSession[]>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  }
};

