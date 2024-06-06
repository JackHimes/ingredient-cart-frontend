import axios from 'axios';
import { TokenHandler } from '../types/TokenHandler';

class KrogerTokenHandler implements TokenHandler {
  async fetchAccessToken(authorizationCode: string, redirectUri: string): Promise<any> {
    const response = await axios.post('/api/auth/fetchAccessToken', {
      authorizationCode,
      redirectUri,
      grocer: 'kroger', // Hardcoded for now
    });
    return response.data;
  }

  async refreshAccessToken(refreshToken: string, redirectUri: string): Promise<any> {
    const response = await axios.post('/api/auth/refreshAccessToken', {
      refreshToken,
      redirectUri,
      grocer: 'kroger', // Hardcoded for now
    });
    return response.data;
  }
}

export default KrogerTokenHandler;