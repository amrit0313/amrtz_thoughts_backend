import { Injectable } from "@nestjs/common";
import { Max, Min, IsOptional, IsString, IsNumber, MinLength, MaxLength } from "class-validator";

@Injectable()
export class CreateFriendshipDto{
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    name: string

}