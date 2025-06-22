/* eslint-disable no-unused-vars */
import CryptoJs from 'crypto-js';

const SECRET_KEY = 'securevault@123';

export const encryptPassword = (plainText, key) => {
    return CryptoJs.AES.encrypt(plainText, key).toString();
}

export const decryptPassword = (cipherText, key) => {
    try{
        const bytes = CryptoJs.AES.decrypt(cipherText, key);
        const decrypted = bytes.toString(CryptoJs.enc.Utf8);
        if (!decrypted) throw new Error('Decryption failed');
        return decrypted;
    } catch (err) {
        // console.warn("Failed to decrypt: ", cipherText, err.message);
        return '[Corrupted or Invalid Password]';
    }
};