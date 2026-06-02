// users/dto/update-profile.dto.ts
import { IsEnum, IsOptional, IsString, MinLength, IsEmail } from 'class-validator';
import { Genre } from '../enums/user.enums';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsEnum(Genre)
  genre?: Genre;
}