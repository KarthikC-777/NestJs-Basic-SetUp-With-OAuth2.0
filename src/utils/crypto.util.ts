import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * It takes a message, an algorithm, an IV length, and a key, and returns an encrypted message
 * @param {string} msg - The message to be encrypted.
 * @param [algorithm=aes-192-cbc] - The algorithm to use for encryption.
 * @param [ivLength=16] - The initialization vector is a random string of bytes that is used to
 * randomize the encryption process.
 * @param {string} [key] - The secret key used to encrypt and decrypt the message @default {process.env["CRYPTO-SECRET"]}.
 * @returns The encrypted message.
 */
const encrypt = (
  msg: string,
  algorithm = 'aes-192-cbc',
  ivLength = 16,
  key?: string,
): string => {
  const configService = new ConfigService();
  key = key || configService.get<string>('CRYPTO-SECRET');
  const encKey = crypto.scryptSync(key, 'salt', 24); // 24 because aes-192-cbc needs 24 bytes key
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, encKey, iv);
  let encrypted = cipher.update(msg);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * It takes a string, decrypts it, and returns the decrypted string
 * @param {string} encodedCipher - The encrypted string that you want to decrypt.
 * @param [algorithm=aes-192-cbc] - The algorithm to use for encryption.
 * @param {string} [key] - The secret key used to encrypt and decrypt the data @default {process.env["CRYPTO-SECRET"]}.
 * @returns The decrypted string.
 */
const decrypt = (
  encodedCipher: string,
  algorithm = 'aes-192-cbc',
  key?: string,
): string => {
  const configService = new ConfigService();
  key = key || configService.get<string>('CRYPTO-SECRET');
  const encKey = crypto.scryptSync(key, 'salt', 24); // 24 because aes-192-cbc needs 24 bytes key
  const textParts = encodedCipher.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, encKey, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const cryptoUtil = { encrypt, decrypt };
