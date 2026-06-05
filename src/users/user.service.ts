//user.services.ts

import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Genre } from './enums/user.enums';
import { Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createUser(email: string, passwordHash: string) {
    const user = this.repo.create({ email, passwordHash });
    return await this.repo.save(user);
  }

  async findUsers(currentUserId: string) {
    const id = Number(currentUserId);
    const users = await this.repo.find({
      where: { id: Not(id) },
    });
    return users;
  }

  async findByEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }

  async findById(id: number) {
    return await this.repo.findOne({ where: { id } });
  }
  async createUserFromOAuth(data: { email: string; name: string }) {
    const user = this.repo.create({
      email: data.email,
      name: data.name,
    });

    return await this.repo.save(user);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const updates: Partial<User> = {};

    if (file) {
      const result = await this.cloudinaryService.uploadImage(file);
      updates.profilePic = result.secure_url;
    }

    if (dto.genre) {
      updates.genre = dto.genre;
    }

    const id = Number(userId);
    if (Number.isNaN(id)) throw new BadRequestException('Invalid user id');

    await this.repo.update(id, updates);
    return this.repo.findOne({ where: { id } });
  }
}
