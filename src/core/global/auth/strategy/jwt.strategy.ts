import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EConfiguration } from '@core/config';
import { ECommonStatus, ErrorMessage, EAppLanguage } from '@core/enum';
import { ConstanceService } from '@core/global/constance/constance.service';

import { AuthService } from '../auth.service';
import { IJwtPayload } from '../interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private constanceService: ConstanceService,
    private authService: AuthService,
    public configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(EConfiguration.JWT_SECRET),
    });
  }

  async validate(payload: IJwtPayload) {
    // [Auth] step 2: can you check user expire plan purchase in here

    const userExist = await this.authService.getUserById(+payload.uid);

    if (!userExist || userExist.isActive === ECommonStatus.NO)
      throw new HttpException(
        ErrorMessage.ACCOUNT_NOT_EXISTS,
        HttpStatus.BAD_REQUEST,
      );

    //TODO set header
    this.constanceService.setFallbackLanguage(EAppLanguage.JA);

    // can you check token black in here
    // const tokenBlack = await this.authService.getTokenBlack(userExist.token);
    // if (tokenBlack)
    //   throw new HttpException(
    //     ErrorMessage.TOKEN_FAILED,
    //     HttpStatus.BAD_REQUEST,
    //   );

    return payload;
  }
}
