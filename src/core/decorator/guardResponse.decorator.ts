import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GuardResponse = createParamDecorator(
  (property: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const data = request['guard'];

    return property ? data?.[property] : data;
  },
);
