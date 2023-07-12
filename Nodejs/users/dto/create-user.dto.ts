import { IsString } from 'class-validator';
import { Milestone } from '../types/user.type';

export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  firebase_id: string;

  milestones: Milestone;
}
