import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { EAppLanguage, ErrorMessage } from '@core/enum';
import { ConstanceService } from '@core/global/constance/constance.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger('Exception');
  constructor(
    private readonly i18n: I18nService,
    private constanceService: ConstanceService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorCode = '';

    if (typeof message === 'string') {
      errorCode = message.replace('error.', '');
      message = await this.i18n.translate(message, {
        lang: this.constanceService.getFallbackLanguage() || EAppLanguage.JA,
      });
    }

    if (typeof message === 'object') {
      errorCode = ErrorMessage.INVALID_PARAM;
      if (message[`statusCode`] === HttpStatus.NOT_ACCEPTABLE) {
        message = await this.i18n.translate(ErrorMessage.INVALID_PARAM, {
          lang: this.constanceService.getFallbackLanguage() || EAppLanguage.JA,
        });
      }
    }

    this.logger.log(`[Exception] - ${message[`message`]}`, message);
    // eslint-disable-next-line no-console
    // console.trace('Log Trace', exception);

    if (status === HttpStatus.NOT_FOUND) {
      response.status(status).json('Not found');
    } else
      response.status(status).json({
        statusCode: status,
        data: null,
        errorMessage: message,
        errorCode,
        timestamp: new Date().toISOString(),
        // path: request.url,
      });
  }
}
