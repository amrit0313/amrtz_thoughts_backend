import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new Error('User already exists');

    const hash = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser(email, hash);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return {
      user,
      access_token: token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid Credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    return { access_token: token, user };
  }

  async oauthLogin(oauthUser: any) {
    // 1. Check if user exists
    let user = await this.userService.findByEmail(oauthUser.email);

    // 2. If not, create user
    if (!user) {
      user = await this.userService.createUserFromOAuth({
        email: oauthUser.email,
        name: oauthUser.name,
      });
    }

    // 3. Generate YOUR JWT (important!)
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user,
      access_token: token,
    };
  }
}
