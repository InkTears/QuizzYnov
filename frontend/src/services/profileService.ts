import { profileApi } from '../api/profileApi';
import type { PlayerSession } from '../types/Profile';

const profileService = {
  getMySessions: async (): Promise<PlayerSession[]> => {
    const token = localStorage.getItem('userToken');

    if (!token) {
      throw new Error('Utilisateur non authentifie');
    }

    return profileApi.getMySessions(token);
  }
};

export default profileService;

