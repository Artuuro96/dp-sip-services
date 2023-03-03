import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { isEmpty } from 'lodash';
import { AcmaClient } from 'src/client/acma.client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly acmaClient: AcmaClient,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.get('authorization').replace('Bearer', '').trim();
    const refreshToken = request.get('refreshtoken');

    if (isEmpty(token)) {
      throw new ForbiddenException('No token found');
    }

    if (isEmpty(refreshToken)) {
      throw new ForbiddenException('No refreshToken found');
    }

    const auth = await this.acmaClient.authRequest(token, refreshToken);

    const user = await this.jwtService.decode(auth.accessToken);
    request.user = user;

    return true;
  }
}
