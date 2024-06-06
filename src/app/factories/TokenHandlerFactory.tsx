import KrogerTokenHandler from '../handlers/KrogerTokenHandler';
import { TokenHandler } from '../types/TokenHandler';

export const getTokenHandler = (grocer: string): TokenHandler => {
  switch (grocer.toLowerCase()) {
    case 'kroger':
      return new KrogerTokenHandler();
    // Add cases for other grocers here
    default:
      throw new Error('Unsupported grocer');
  }
};