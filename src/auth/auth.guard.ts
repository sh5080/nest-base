import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from '../type/request.type';
import { authConfig } from '../config/env.config';
import { NextFunction, Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const response = context.switchToHttp().getResponse();
    const nextFunction = () => {
      return true;
    };

    try {
      await this.validateRequest(request, response, nextFunction);
      return true;
    } catch (err) {
      throw err;
    }
  }

  private async validateRequest(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    let accessToken: string;

    try {
      accessToken = req.headers.authorization.replace(/^Bearer /, '');

      const accessSecret = authConfig().ACCESS_JWT_SECRET;
      const { userId, role } = await this.authService.verify(
        accessToken,
        accessSecret,
        'access',
      );
      if (!role) {
        req.user = { userId } as AuthRequest;
      }
      req.user = { userId, role } as AuthRequest;
      next();
    } catch (err) {
      if (err.message === 'Token expired') {
        throw new UnauthorizedException('만료된 access 토큰입니다.');
      }
      if (err.message === 'Token invalid') {
        try {
          let refreshToken = req.headers.authorization.replace(/^Bearer /, '');
          const refreshSecret = authConfig().REFRESH_JWT_SECRET;
          const refreshData = await this.authService.verify(
            refreshToken,
            refreshSecret,
            'refresh',
          );
          const accessEnv = authConfig().ACCESS_JWT_EXPIRATION;
          const refreshEnv = authConfig().REFRESH_JWT_EXPIRATION;

          const now = new Date();
          const accessExp = new Date(now.getTime() + accessEnv * 1000);
          const refreshExp = new Date(now.getTime() + refreshEnv * 1000);

          const accessOptions: {
            expires: Date;
            httpOnly: boolean;
            secure?: boolean | undefined;
          } = {
            expires: accessExp,
            httpOnly: true,
          };

          const refreshOptions: {
            expires: Date;
            httpOnly: boolean;
            secure?: boolean | undefined;
          } = {
            expires: refreshExp,
            httpOnly: true,
          };

          if (process.env.NODE_ENV === 'production') {
            accessOptions.secure = true;
            refreshOptions.secure = true;
          }
          const ip = req.ip;
          const userAgent = req.get('User-Agent');
          const token = await this.authService.updateTokens(
            refreshData.userId,
            ip,
            userAgent,
          );
          res
            .cookie('access', token.newAccessToken, accessOptions)
            .cookie('refresh', token.newRefreshToken, refreshOptions)
            .json({ token });
        } catch (err) {
          throw new UnauthorizedException('유효하지 않은 refresh 토큰입니다.');
        }
      } else throw new InternalServerErrorException('접근 거부');
    }
  }
}
