import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { TrackUserActivityDTO } from './dto/track-user-activity.dto';
import { UpdateBadgeDTO } from './dto/update-badge.dto';

@UseGuards(FirebaseAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @Get(':id')
  getUser(@Param('id') firebase_id: string) {
    return this.userService.findById(firebase_id);
  }

  @Patch()
  updateUser(@Body() userData: UpdateUserDTO) {
    return this.userService.updateUser(userData);
  }

  @Delete()
  deleteUser(@Body() userData: DeleteUserDTO) {
    return this.userService.deleteUser(userData);
  }

  @Get('/badges')
  checkUserHasBadge(@Body() badgeDTO: UpdateBadgeDTO) {
    return this.userService.checkUserHasBadge(badgeDTO);
  }

  @Get('/:id/badges')
  getUserBadges(@Param('id') firebase_id: string) {
    return this.userService.getUserBadges(firebase_id);
  }

  @Post('/track')
  trackUserActivity(@Body() trackUserActivityDTO: TrackUserActivityDTO) {
    return this.userService.trackUserActivity(trackUserActivityDTO);
  }
}
