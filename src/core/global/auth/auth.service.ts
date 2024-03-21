import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ECommonStatus, ErrorMessage } from '@core/enum';
import { VSystemLoginDto } from '@core/global/auth/dto/systemLogin.dto';
import { VSignUpDto } from '@core/global/auth/dto/systemSignUp.dto';
import { PrismaService } from '@core/global/prisma/prisma.service';
import { handleBCRYPTCompare, handleBCRYPTHash } from '@helper/utils';

// import { IResponseAuth } from './interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async getUserById(id: number) {
    return { id, isActive: ECommonStatus.YES };
  }

  async login(body: VSystemLoginDto) {
    const { email, password } = body;

    const accountExist = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        avatarUrl: true,
        role: true,
      },
    });

    if (!accountExist)
      throw new HttpException(
        ErrorMessage.EMAIL_OR_PASSWORD_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );

    const isPasswordHash = await handleBCRYPTCompare(
      password,
      accountExist.password,
    );

    if (!isPasswordHash) {
      throw new HttpException(
        ErrorMessage.EMAIL_OR_PASSWORD_INCORRECT,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = {
      uid: accountExist.id,
      eml: accountExist.email,
      per: [],
      rol: accountExist.role,
    };

    const { password: userPass, ...userData } = accountExist;

    const token = await this.returnResponseAuth(payload);
    return {
      token,
    };
  }

  async returnResponseAuth(payload): Promise<string> {
    const payloadToken = {
      uid: payload.uid,
      eml: payload.eml,
      rol: payload.rol,
      per: payload.per,
    };
    const token = this.jwtService.sign(payloadToken);

    return token;
  }

  async signUp(body: VSignUpDto) {
    const { email, password, fullName, avatarUrl } = body;

    const existEmail = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existEmail) {
      throw new HttpException(
        ErrorMessage.EMAIL_EXISTS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await handleBCRYPTHash(password);

    const user = await this.prisma.user.create({
      data: { email, password: passwordHash, fullName, avatarUrl },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
      },
    });

    const payload = {
      uid: user.id,
      eml: user.email,
      per: [],
      rol: user.role,
    };

    const token = await this.returnResponseAuth(payload);
    return {
      token,
    };
  }
}
