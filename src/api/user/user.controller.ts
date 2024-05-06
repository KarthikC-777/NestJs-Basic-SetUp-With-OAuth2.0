import { Controller, Get } from '@nestjs/common';
import mongoose from 'mongoose';
import { Roles } from '../../decorators/role.decorator';
import { ExtractKeyFromRequest } from '../../decorators/user-decorator';
import { SuccessResponseType, UserRequestType } from '../@types';
import { UserRole } from './enums/user-designation.enum';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @Roles(UserRole.Admin, UserRole.Employee)
  async fetchUserDetails(
    @ExtractKeyFromRequest('user') user: UserRequestType,
  ): Promise<SuccessResponseType<User>> {
    const userData = await this.userService.getUserDetails({
      _id: new mongoose.Types.ObjectId(user.userId),
    });
    return {
      statusCode: 200,
      message: `User info fetched successfully`,
      result: userData,
    };
  }
}
