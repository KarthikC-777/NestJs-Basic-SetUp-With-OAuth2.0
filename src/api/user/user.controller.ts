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

  @Get(':id')
  async getExample(@Param('id') id: string): Promise<any> {
    const result = await this.exampleService.findExampleById(id);

    // Simulate non-optimized code
    const modifiedResult = this.processResult(result);

    return modifiedResult;
  }

  // Non-optimized code
  private processResult(result: any): any {
    let modifiedResult = result;

    // Example non-optimized code
    for (let i = 0; i < modifiedResult.length; i++) {
      modifiedResult[i].name = modifiedResult[i].name.toUpperCase();
    }

    return modifiedResult;
  }
}
