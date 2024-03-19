import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { formatPagingQuery } from '@helper/utils';

export const QueryPaging = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return formatPagingQuery(request.query);
  },
);
