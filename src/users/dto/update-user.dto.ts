import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsStrongPassword } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsStrongPassword()
  oldPassword: string;

  @IsStrongPassword()
  newPassword: string;
}
