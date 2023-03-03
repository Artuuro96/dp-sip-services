import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from '../context/execution-ctx';

export const ExecutionCtx = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return extractContext(request);
});

export const extractContext = (req) => {
  return new Context(req.user);
};
