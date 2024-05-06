import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import { FALLBACK_VALUES } from '../constants/common.constants';
import { PayloadType, UserRequestType } from '../api/@types';
import { currDate, updateDateTime } from '../utils/date_time.util';

@Injectable()
export class Jwt {
  private storeSSLKeyData: Record<string, string> = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * It takes Payload as PayloadType , host ,url and returns accessToken and expiresIn
   * @param {PayloadType} payload - parameter used to sign jwtService which includes Pick<User, 'email' | '_id'> & { id: string }.
   * @param {string}host - The host name.
   * @param {string}url - The url name.
   * @returns {string} accessToken and {number} expiresIn.
   */
  encode(
    payload: PayloadType,
    host: string,
    url: string,
  ): { accessToken: string; expiresIn: number } {
    // access token expiry
    const expiresIn = Number(
      updateDateTime(
        currDate(),
        this.configService.get('JWT-EXPIRES-IN'),
        2,
        'h',
      ).format('X'),
    );
    const accessToken = this.jwtService.sign(
      {
        email: payload.email, //email is the email of the user
        userId: payload.userId, //userId is the _id of user in user collection
        id: payload.authId, //id is _id of the auth in auth collection
        role: payload.role,
      },
      {
        secret: this.getKeyData(this.configService.get<string>('PVT-KEY')),
        algorithm: 'RS256',
        issuer: host + url,
        audience: host, // host
        subject: payload.userId,
        mutatePayload:
          String(
            this.configService.get(
              'JWT-MUTATE-PAYLOAD',
              FALLBACK_VALUES.JWT_MUTATE_PAYLOAD,
            ),
          ) === 'true',
        noTimestamp:
          String(
            this.configService.get(
              'JWT-NO-TIMESTAMP',
              FALLBACK_VALUES.JWT_NO_TIMESTAMP,
            ),
          ) === 'true',
        expiresIn: this.configService.get(
          'JWT-EXPIRES-IN',
          FALLBACK_VALUES.JWT_EXPIRES_IN,
        ),
      },
    );
    return { accessToken, expiresIn };
  }
  /**
   * The verify method takes the JWT and the secret key as arguments and returns UserRequestType.
   * It ensures that the token was signed by a trusted party and that the contents of the token have not been tampered with.
   */
  verify(token: string): UserRequestType {
    return this.jwtService.verify<UserRequestType>(token, {
      secret: this.getKeyData(this.configService.get<string>('PUB-KEY')),
    });
  }
  /**
   * This method is used to decode the JWT and extract its payload
   *  It does not verify the authenticity or integrity of the token
   */
  decode(token: string):
    | string
    | {
        [key: string]: unknown;
      } {
    return this.jwtService.decode(token);
  }

  private getKeyData(keyPath: string): string {
    const storedData = this.storeSSLKeyData[keyPath];
    if (!storedData) {
      const data = fs.readFileSync(keyPath, 'utf8');
      this.storeSSLKeyData[keyPath] = data;
      return data;
    }
    return storedData;
  }
}
