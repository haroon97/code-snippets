import { IsOptional, IsString } from 'class-validator';
import { UpdateBadgeDTO } from './update-badge.dto';

export class TrackUserActivityDTO extends UpdateBadgeDTO {
  @IsString()
  @IsOptional()
  resourceId?: string;
}
