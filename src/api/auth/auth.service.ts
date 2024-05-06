import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Jwt } from '../../config/jwt';
import { cryptoUtil } from '../../utils/crypto.util';
import {
  currDate,
  currentUnixTimestampSeconds,
  toUTC,
  updateDateTime,
} from '../../utils/date_time.util';
import { constructErrorMessage } from '../../utils/response-message.util';
import { PayloadType, UserRequestType } from '../@types';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { AccessTokenResponse } from './responses/access-token.response';
import { RefreshTokenResponse } from './responses/refresh-token.response';
import { Auth } from './schemas/auth.schema';
import { logger } from '../../config/logger';
import { getLoggerPrefix } from '../../utils/logger-debug.util';
import { AUTH } from '../../constants/common.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: mongoose.Model<Auth | null>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwt: Jwt,
  ) {}
  async login(
    loginDto: LoginDto,
    host: string,
    url: string,
  ): Promise<AccessTokenResponse> {
    // check if user name and password matches
    const userDetail = await this.userService.getUserDetails({
      email: loginDto.email.trim().toLowerCase(),
    });

    if (!userDetail) {
      throw new UnauthorizedException(
        constructErrorMessage('DEFAULT.CREDENTIAL_MISMATCH'),
      );
    }

    const authId = new mongoose.Types.ObjectId();
    const userId = userDetail._id.toString();
    //setting payLoad for encode jwt
    const payLoad: PayloadType = {
      email: userDetail.email,
      userId: userDetail._id.toString(),
      authId: authId.toString(),
      role: userDetail.role,
    };
    // generate token
    const { accessToken, expiresIn: accessTokenExpiresIn } = this.jwt.encode(
      payLoad,
      host,
      url,
    );

    // generate refresh token
    const refreshToken = cryptoUtil.encrypt(JSON.stringify({ authId, userId }));

    const refreshTokenExpiresIn = Number(
      updateDateTime(
        currDate(),
        this.configService.get('JWT-REFRESH-TOKEN-EXPIRY'),
        7,
        'd',
      ).format('X'),
    );

    // store session details in db
    await this.storeSessionDetails(
      userDetail,
      authId,
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn,
    );

    return {
      accessToken: accessToken,
      tokenType: 'Bearer',
      expiresIn: accessTokenExpiresIn,
      refreshToken: refreshToken,
      sessionId: authId,
      userId,
    };
  }

  async storeSessionDetails(
    userDetail: User,
    authId: Types.ObjectId,
    accessToken: string,
    accessTokenExpiresIn: number,
    refreshToken: string,
    refreshTokenExpiresIn: number,
  ) {
    const authDetails = await this.authModel.findOne({
      userId: userDetail._id,
    });
    const newSession = {
      _id: authId,
      accessToken: accessToken,
      accessTokenExpiresIn: accessTokenExpiresIn,
      refreshToken: refreshToken,
      refreshTokenExpiresIn: refreshTokenExpiresIn,
    };
    if (!authDetails) {
      const authObj = {
        _id: new mongoose.Types.ObjectId(),
        userId: userDetail._id,
        sessions: {
          _id: authId,
          accessToken: accessToken,
          accessTokenExpiresIn: accessTokenExpiresIn,
          refreshToken: refreshToken,
          refreshTokenExpiresIn: refreshTokenExpiresIn,
        },
        createdBy: userDetail._id,
        createdAt: toUTC(currDate()),
      };
      await new this.authModel(authObj).save();
    } else {
      authDetails.sessions.unshift(newSession); //TODO:  implement to allow max 5 sessions
      if (authDetails.sessions.length > AUTH.MAXIMUM_SESSION) {
        authDetails.sessions.pop();
      }
      await authDetails.save();
    }
  }

  // return null for unauthorized and delete the cookie
  async refresh(
    userId: string,
    authId: string,
    host: string,
    url: string,
  ): Promise<RefreshTokenResponse | null> {
    // check if user is active
    const activeUser = await this.userService.getUserDetails({
      _id: userId,
      deletedAt: { $exists: false },
      deletedBy: { $exists: false },
    });

    if (!activeUser) {
      return null;
    }

    // generate new access token
    const payLoad: PayloadType = {
      email: activeUser.email,
      userId: activeUser._id.toString(),
      authId,
      role: activeUser.role,
    };

    const { accessToken: newAccessToken, expiresIn: accessTokenExpiresIn } =
      this.jwt.encode(payLoad, host, url);

    const session = await this.findSessionAndUpdate(
      activeUser._id,
      authId,
      newAccessToken,
      accessTokenExpiresIn,
    );

    if (!session) {
      return null;
    }

    return {
      accessToken: newAccessToken,
      tokenType: 'Bearer',
      expiresIn: accessTokenExpiresIn,
    };
  }

  async findSessionAndUpdate(
    userId: Types.ObjectId,
    authId: string,
    newAccessToken: string,
    accessTokenExpiresIn: number,
  ): Promise<boolean> {
    logger.debug(`${getLoggerPrefix()}:finding session for id : ${authId}`);

    const expiredSession = await this.authModel.updateOne(
      {
        userId,
        'sessions._id': new mongoose.Types.ObjectId(authId),
        'sessions.refreshTokenExpiresIn': {
          $lt: currentUnixTimestampSeconds(),
        },
      },
      {
        $pull: {
          sessions: {
            refreshTokenExpiresIn: { $lt: currentUnixTimestampSeconds() },
            _id: new mongoose.Types.ObjectId(authId),
          },
        },
      },
      { new: true },
    );

    if (expiredSession.modifiedCount > 0) return false;
    const updateSession = await this.authModel.updateOne(
      {
        userId,
        'sessions._id': new mongoose.Types.ObjectId(authId),
      },
      {
        $set: {
          'sessions.$.accessToken': newAccessToken,
          'sessions.$.accessTokenExpiresIn': accessTokenExpiresIn,
          updatedAt: toUTC(currDate()),
          updatedBy: userId,
        },
      },
      { new: true },
    );
    return updateSession.modifiedCount > 0;
  }

  async logout(user: UserRequestType): Promise<null | boolean> {
    const response = await this.deleteSession(user.userId, user.id);
    if (!response) return null;
    return true;
  }

  async deleteSession(userId: string, authId: string): Promise<boolean> {
    const deleteSession = await this.authModel.updateOne(
      {
        userId: new mongoose.Types.ObjectId(userId),
        'sessions._id': new mongoose.Types.ObjectId(authId),
      },
      {
        $pull: {
          sessions: {
            _id: new mongoose.Types.ObjectId(authId),
          },
        },
      },
      { new: true },
    );
    return deleteSession.modifiedCount > 0;
  }
}
