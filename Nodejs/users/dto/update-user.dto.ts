import { IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  firebase_id: string;
}
