import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { tenantLocalStorage } from './tenant.context';

export const CurrentTenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const store = tenantLocalStorage.getStore();
    if (!store || !store.tenantId) {
      throw new BadRequestException('Active tenant context is required.');
    }
    return store.tenantId;
  },
);
