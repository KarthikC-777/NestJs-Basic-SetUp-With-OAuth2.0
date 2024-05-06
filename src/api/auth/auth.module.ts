import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { ConfigService } from '@nestjs/config';
import { Jwt } from '../../config/jwt';
import { AuthSchema } from './schemas/auth.schema';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService, Jwt, ConfigService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'auth', method: RequestMethod.POST })
      .forRoutes(AuthController);
  }
}
