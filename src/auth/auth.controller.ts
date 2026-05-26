import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private AuthService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('signup')
  signup(@Body() body: { email: string; password: string }) {
    return this.AuthService.signup(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.AuthService.login(body.email, body.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.AuthService.oauthLogin(req.user);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');

      const userParam = encodeURIComponent(JSON.stringify(result.user));

      res.redirect(
        `${frontendUrl}/auth/google/callback?token=${result.access_token}&user=${userParam}`,
      );
    } catch (error) {
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.AuthService.oauthLogin(req.user);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      const userParam = encodeURIComponent(JSON.stringify(result.user));

      res.redirect(
        `${frontendUrl}/login?token=${result.access_token}&user=${userParam}&provider=facebook`,
      );
    } catch {
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      res.redirect(`${frontendUrl}/login?error=auth_failed&provider=facebook`);
    }
  }

  @Get('ano')
  View() {
    return 'hey there';
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Req() req: Request & { user?: any }) {
    return req?.user;
  }
}
