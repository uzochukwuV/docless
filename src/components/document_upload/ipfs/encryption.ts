import CryptoJS from 'crypto-js';


export const encryptFile = async (file: File): Promise<{ encryptedFile: Blob; key: string }> => {
  const key = CryptoJS.lib.WordArray.random(256/8).toString();
  
  const arrayBuffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
  
  const encryptedFile = new Blob([encrypted], { type: 'application/encrypted' });
  
  return { encryptedFile: encryptedFile, key };
};

export const hashKey = (key: string): string => {
  return CryptoJS.SHA256(key).toString();
};