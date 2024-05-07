import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import mongoose from 'mongoose';
import { Roles } from '../../decorators/role.decorator';
import { ExtractKeyFromRequest } from '../../decorators/user-decorator';
import { SuccessResponseType, UserRequestType } from '../@types';
import { UserRole } from './enums/user-designation.enum';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { constructErrorMessage } from '../../utils/response-message.util';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/user')
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

  @Get('/users')
  @Roles(UserRole.Admin, UserRole.Employee)
  async fetchAllUserDetails(): Promise<SuccessResponseType<User[]>> {
    const usersData = await this.userService.getAllUserDetails();
    return {
      statusCode: 200,
      message: `Users list fetched successfully`,
      result: usersData,
    };
  }

  @Get('/users/:userId')
  @Roles(UserRole.Admin, UserRole.Employee)
  async fetchUserDetailsById(
    @Param('userId') userId: string,
  ): Promise<SuccessResponseType<User>> {
    const userData = await this.userService.getUserDetails({
      _id: new mongoose.Types.ObjectId(userId),
    });
    if (!userData) {
      throw new NotFoundException(
        constructErrorMessage(
          'DB.MODULE_NOT_FOUND',
          { MODULE: 'User' },
          'User.NOT_FOUND',
        ),
      );
    }
    return {
      statusCode: 200,
      message: `User info fetched successfully for userId- ${userId}`,
      result: userData,
    };
  }
}
