import environment from '@/core/environment';
import CryptoJS from 'crypto-js';

export const decrypt = (encrypted: string): string => {
    const bytes = CryptoJS.AES.decrypt(encrypted, environment.SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};
