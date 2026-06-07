import {Module} from '@nestjs/common'
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendshipService } from "./friendships.service";
import { Friendships } from "./friendships.entity";
import { FriendshipController } from "./friendships.controller";
import { User } from 'src/users/user.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Friendships, User])],
    providers:[FriendshipService],
    controllers:[FriendshipController]
})

export class FriendshipModule{}