import { Injectable, UnauthorizedException } from '@nestjs/common';
import { tenantLocalStorage } from './tenant.context';

@Injectable()
export class TenantService {
  getTenantId(): string {
    const store = tenantLocalStorage.getStore();
    if (!store || !store.tenantId) {
      throw new UnauthorizedException('Tenant context is missing or invalid.');
    }
    return store.tenantId;
  }

  getTenantIdOptional(): string | null {
    const store = tenantLocalStorage.getStore();
    return store?.tenantId || null;
  }
}
