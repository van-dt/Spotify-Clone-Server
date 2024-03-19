import { Global, Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

import { I18nCustomService } from './i18nCustom.service';

@Global()
@Module({
  providers: [I18nCustomService],
  exports: [I18nCustomService],
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'ja',
      loaderOptions: {
        path: `${process.cwd()}/i18n`,
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
  ],
})
export class I18nCustomModule {}
