import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import * as admin from 'firebase-admin';
import { Badge, BadgeDocument } from 'src/badges/schema/badge.schema';
import { TrackUserActivityDTO } from './dto/track-user-activity.dto';
import { BadgeId } from 'src/constants';
import { UpdateBadgeDTO } from './dto/update-badge.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Badge.name)
    private badgeModel: Model<BadgeDocument>,
  ) {}

  async create(createUserDTO: CreateUserDTO) {
    const user = await this.findOne(createUserDTO.email);
    if (!user) {
      const createdUser = new this.userModel(createUserDTO);
      const badges = await this.badgeModel.find({});
      const milestones = {} as Map<
        string,
        { target: number; resourceIds: string[] }
      >;
      for (let i = 0; i < badges.length; i++) {
        if (badges[i].id === BadgeId.Dedicated) {
          milestones[badges[i].id] = { target: 29, resourceIds: [] };
        } else if (badges[i].id === BadgeId.Committed) {
          milestones[badges[i].id] = { target: 57, resourceIds: [] };
        } else if (badges[i].id === BadgeId.Completionist) {
          milestones[badges[i].id] = { target: 86, resourceIds: [] };
        } else {
          milestones[badges[i].id] = { target: 0, resourceIds: [] };
        }
      }
      createdUser.milestones = milestones;
      await createdUser.save();
      return {
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        firebase_id: createdUser.firebase_id,
        milestones: createdUser.milestones,
      };
    }
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      firebase_id: user.firebase_id,
      milestones: user.milestones,
    };
  }

  async findOne(email: string) {
    return this.userModel.findOne({ email });
  }

  async findById(firebase_id: string) {
    try {
      const user = await this.userModel.findOne({ firebase_id });
      if (user) {
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          badges: user.badges,
          milestones: user.milestones,
        };
      }
      throw new NotFoundException();
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async updateUser(updateUserDTO: UpdateUserDTO) {
    const user = await this.userModel.findOne({
      firebase_id: updateUserDTO.firebase_id,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.firstName = updateUserDTO.firstName;
    user.lastName = updateUserDTO.lastName;
    const updatedUser = await user.save();

    return updatedUser;
  }

  async deleteUser(deleteUserDTO: DeleteUserDTO) {
    try {
      const deletedUser = await Promise.all([
        admin.auth().deleteUser(deleteUserDTO.firebase_id),
        this.userModel.findOneAndDelete({
          firebase_id: deleteUserDTO.firebase_id,
        }),
      ]);
      return {
        email: deletedUser[1].email,
        firebase_id: deletedUser[1].firebase_id,
        userDeleted: true,
      };
    } catch (error) {
      return {
        userDeleted: false,
        message: 'User deletion failed: ' + error.message,
      };
    }
  }

  async getUserBadges(firebase_id: string) {
    const user = await this.userModel
      .findOne({ firebase_id })
      .populate('badges')
      .exec();

    if (!user) {
      return {
        badges: [],
        message: 'User does not exist',
      };
    }

    if (!user.badges.length) {
      return {
        badges: [],
        message: 'No badges were found',
      };
    }
    return user.badges;
  }

  async checkUserHasBadge(badgeDTO: UpdateBadgeDTO) {
    const user = await this.userModel.find({
      $and: [
        { firebase_id: badgeDTO.firebase_id },
        { badges: { $in: [badgeDTO.badgeId] } },
      ],
    });

    if (!user.length) {
      return {
        hasBadge: false,
        message: 'Badge not found',
      };
    }

    return {
      hasBadge: true,
      message: 'User has badge',
    };
  }

  async trackUserActivity(trackUserActivityDTO: TrackUserActivityDTO) {
    const user = await this.userModel.findOne({
      firebase_id: trackUserActivityDTO.firebase_id,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userHasBadge = await this.checkUserHasBadge({
      firebase_id: trackUserActivityDTO.firebase_id,
      badgeId: trackUserActivityDTO.badgeId,
    });

    if (userHasBadge.hasBadge) {
      return userHasBadge;
    }

    const userMilestones = user.milestones.get(trackUserActivityDTO.badgeId);

    if (trackUserActivityDTO?.resourceId) {
      const resourceAlreadyRegistered = userMilestones.resourceIds.includes(
        trackUserActivityDTO.resourceId,
      );

      if (resourceAlreadyRegistered) {
        return {
          message: 'Already registered',
        };
      }
    }

    const currentCount = userMilestones.target;
    const resourceIds = userMilestones.resourceIds;
    user.milestones.set(trackUserActivityDTO.badgeId, {
      target: currentCount + 1,
      resourceIds: [...resourceIds, trackUserActivityDTO.resourceId],
    });
    await user.save();

    const badge = await this.badgeModel.findById(trackUserActivityDTO.badgeId);

    if (currentCount + 1 === badge.target) {
      user.badges.push(badge.id);

      await user.save();

      return {
        badgeId: badge.id,
        badgeName: badge.name,
        badgeDescription: badge.description,
        awardBadge: true,
      };
    }

    return {
      badgeId: badge.id,
      badgeName: badge.name,
      badgeDescription: badge.description,
      milestone: user.milestones.get(trackUserActivityDTO.badgeId),
      awardBadge: false,
    };
  }
}
