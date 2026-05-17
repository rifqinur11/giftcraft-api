import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { tenantLocalStorage } from './tenant.context';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;

    // For public routes, auth routes, or during initial development, you might want to skip this or allow empty.
    // However, to enforce strict tenant isolation, we validate unless it's a bypass path.
    const bypassPaths = ['/auth/login', '/auth/register', '/health'];
    const isBypass = req.originalUrl === '/' || bypassPaths.some((path) => req.originalUrl.startsWith(path));

    if (!tenantId && !isBypass) {
      throw new BadRequestException('x-tenant-id header is required');
    }

    if (tenantId) {
      tenantLocalStorage.run({ tenantId }, () => {
        next();
      });
    } else {
      next();
    }
  }
}
