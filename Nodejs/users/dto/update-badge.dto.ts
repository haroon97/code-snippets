import { IsString } from 'class-validator';

export class UpdateBadgeDTO {
  @IsString()
  firebase_id: string;

  @IsString()
  badgeId: string;
}
