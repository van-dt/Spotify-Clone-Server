import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export interface IResponsePost<T> {
  data: T;
}

@Injectable()
export class PostInterceptor<T>
  implements NestInterceptor<T, IResponsePost<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponsePost<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();

    if (request.method === 'POST') {
      if (response.statusCode === 201)
        context.switchToHttp().getResponse().status(HttpStatus.OK);
    }
    return next.handle();
  }
}
