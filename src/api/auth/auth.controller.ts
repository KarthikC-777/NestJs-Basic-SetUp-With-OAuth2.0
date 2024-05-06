import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import {
  COOKIE_SAME_SITE_POLICY,
  FALLBACK_VALUES,
} from '../../constants/common.constants';
import { ExtractKeyFromRequest } from '../../decorators/user-decorator';
import { cryptoUtil } from '../../utils/crypto.util';
import {
  constructErrorMessage,
  constructSuccessMessage,
} from '../../utils/response-message.util';
import { UserRequestType } from '../@types';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDTO } from './dto/refresh.dto';
import { TokenDTO } from './dto/token.dto';
import { GrantType } from './enums/auth.enum';
import { AccessTokenResponse } from './responses/access-token.response';
import { LoginResponse } from './responses/login.response';
import { RefreshTokenResponse } from './responses/refresh-token.response';

@Controller('auth')
export class AuthController {
  private sameSite: (typeof COOKIE_SAME_SITE_POLICY)[number];
  private refreshTokenMaxAge: number;
  private accessTokenMaxAge: number;
  private secure: boolean;
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.initCookieConfig();
  }
  private initCookieConfig(): void {
    const policy = this.configService.get<
      (typeof COOKIE_SAME_SITE_POLICY)[number]
    >('COOKIE-SAME-SITE-POLICY');
    this.sameSite = COOKIE_SAME_SITE_POLICY.includes(policy) ? policy : 'none';
    this.secure =
      this.configService
        .get<string>('ENV', FALLBACK_VALUES.ENV)
        .toUpperCase() !== 'LOCAL';
    this.accessTokenMaxAge = this.configService.get<number>(
      'ACCESS-TOKEN-COOKIE-TIME',
      FALLBACK_VALUES.ACCESS_TOKEN_COOKIE_TIME,
    ); // 4 hour accessToken valid time
    this.refreshTokenMaxAge = this.configService.get<number>(
      'REFRESH-TOKEN-COOKIE-TIME',
      FALLBACK_VALUES.REFRESH_TOKEN_COOKIE_TIME,
    ); // 7 days refreshToken valid Time
  }

  @Post()
  @HttpCode(200)
  async getAccessToken(
    @Req() req: Request,
    @Res() res: Response,
    @Body()
    generateTokenPayload: TokenDTO,
    @ExtractKeyFromRequest('hostname') host: string,
    @ExtractKeyFromRequest('originalUrl') url: string,
  ): Promise<Response> {
    // check if the token payload has client credentials
    if (generateTokenPayload.grantType === GrantType.REFRESH_TOKEN) {
      return await this.refresh(res, generateTokenPayload, host, url);
    }

    return await this.login(
      res,
      { email: generateTokenPayload.email },
      host,
      url,
    );
  }

  private async login(
    @Res() res: Response,
    @Body() loginBody: LoginDto,
    @ExtractKeyFromRequest('hostname') host: string,
    @ExtractKeyFromRequest('originalUrl') url: string,
  ): Promise<Response<LoginResponse>> {
    const loginResponse: AccessTokenResponse = await this.authService.login(
      loginBody,
      host,
      url,
    );

    res.cookie('accessToken', loginResponse.accessToken, {
      httpOnly: false, //todo: make it true once https certificate is obtained
      secure: this.secure,
      sameSite: this.sameSite,
      maxAge: this.accessTokenMaxAge,
    });
    res.cookie('refreshToken', loginResponse.refreshToken, {
      httpOnly: false,
      secure: this.secure,
      sameSite: this.sameSite,
      maxAge: this.refreshTokenMaxAge,
    });
    return res.send({
      accessToken: loginResponse.accessToken,
      tokenType: loginResponse.tokenType,
      expiresIn: loginResponse.expiresIn,
      refreshToken: loginResponse.refreshToken,
      deleteDate: loginResponse.deleteDate,
    });
  }

  //TODO: add refresh token token to DB
  private async refresh(
    @Res() res: Response,
    @Body() refreshBody: RefreshDTO,
    @ExtractKeyFromRequest('hostname') host: string,
    @ExtractKeyFromRequest('originalUrl') url: string,
  ): Promise<Response<RefreshTokenResponse>> {
    const deleteCookiesAndThrowError = (
      secure: boolean,
      sameSite: (typeof COOKIE_SAME_SITE_POLICY)[number],
    ): void => {
      // delete cookies
      res.clearCookie('accessToken', {
        httpOnly: false,
        secure,
        sameSite,
      });
      res.clearCookie('refreshToken', {
        httpOnly: false,
        secure,
        sameSite,
      });
      throw new UnauthorizedException(constructErrorMessage('XHR_ERROR.401'));
    };

    // decrypt the refresh token
    const decrypted = cryptoUtil.decrypt(refreshBody.refreshToken);

    if (!decrypted) {
      deleteCookiesAndThrowError(this.secure, this.sameSite);
    }
    const refreshPayload: { authId: string; userId: string } =
      JSON.parse(decrypted);
    // get the token from cache
    const refreshResponse: RefreshTokenResponse =
      await this.authService.refresh(
        refreshPayload.userId,
        refreshPayload.authId,
        host,
        url,
      );
    if (!refreshResponse)
      deleteCookiesAndThrowError(this.secure, this.sameSite);

    res.cookie('accessToken', refreshResponse.accessToken, {
      httpOnly: false,
      secure: this.secure,
      sameSite: this.sameSite,
      maxAge: this.accessTokenMaxAge, // 4 hour accessToken valid time
    });
    return res.send(refreshResponse);
  }

  @Delete()
  @HttpCode(200)
  async logout(
    @Res() res: Response,
    @ExtractKeyFromRequest('user') user: UserRequestType,
  ): Promise<Response> {
    const logoutResponse = await this.authService.logout(user);
    // delete cookies
    res.clearCookie('accessToken', {
      httpOnly: false,
      secure: this.secure,
      sameSite: this.sameSite,
    });
    res.clearCookie('refreshToken', {
      httpOnly: false,
      secure: this.secure,
      sameSite: this.sameSite,
    });

    if (!logoutResponse) {
      throw new UnauthorizedException(constructErrorMessage('XHR_ERROR.401'));
    }
    return res.send({
      statusCode: 200,
      message: constructSuccessMessage('AUTH.LOGOUT_SUCCESS', {
        MODULE: 'User',
      }),
      result: null,
    });
  }
}
