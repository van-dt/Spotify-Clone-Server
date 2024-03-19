import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EConfiguration } from '@core/config';
import { AuthController } from '@core/global/auth/auth.controller';
import { AuthService } from '@core/global/auth/auth.service';

import { JwtStrategy } from './strategy/jwt.strategy';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    // UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(EConfiguration.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(EConfiguration.AUTH_TOKEN_EXPIRE),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
