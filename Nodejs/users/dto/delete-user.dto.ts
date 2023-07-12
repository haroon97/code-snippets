import { IsString } from 'class-validator';

export class DeleteUserDTO {
  @IsString()
  firebase_id: string;
}
