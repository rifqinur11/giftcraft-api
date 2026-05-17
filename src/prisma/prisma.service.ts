import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { tenantLocalStorage } from '../common/tenant/tenant.context';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly prismaClient: PrismaClient;
  private readonly pool: Pool;
  public readonly db: any;

  constructor() {
    // Set up connection pool with pg
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Instantiate the PrismaPg adapter for Prisma 7 compliance
    const adapter = new PrismaPg(this.pool);

    // Initialize PrismaClient with adapter
    this.prismaClient = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });

    const tenantScopedModels = ['User', 'Product', 'Invoice'];

    // We extend the PrismaClient to automatically apply tenant scoping
    this.db = this.prismaClient.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }: any) {
            if (tenantScopedModels.includes(model)) {
              const store = tenantLocalStorage.getStore();
              const tenantId = store?.tenantId;

              if (tenantId) {
                const anyArgs = args as any;

                // 1. Scoping read queries
                if (
                  [
                    'findFirst',
                    'findFirstOrThrow',
                    'findMany',
                    'count',
                    'aggregate',
                    'groupBy',
                  ].includes(operation)
                ) {
                  anyArgs.where = { ...anyArgs.where, tenantId };
                }

                // 2. Scoping update / delete queries
                if (
                  ['update', 'updateMany', 'upsert', 'delete', 'deleteMany'].includes(operation)
                ) {
                  anyArgs.where = { ...anyArgs.where, tenantId };
                }

                // 3. Injecting tenantId on creations
                if (operation === 'create') {
                  anyArgs.data = { ...anyArgs.data, tenantId };
                } else if (operation === 'createMany') {
                  if (Array.isArray(anyArgs.data)) {
                    anyArgs.data = anyArgs.data.map((item: any) => ({
                      ...item,
                      tenantId,
                    }));
                  } else if (anyArgs.data) {
                    anyArgs.data = { ...anyArgs.data, tenantId };
                  }
                }
              }
            }
            return query(args);
          },
        },
      },
    });
  }

  async onModuleInit() {
    await this.prismaClient.$connect();
  }

  async onModuleDestroy() {
    await this.prismaClient.$disconnect();
    await this.pool.end(); // close pg pool to avoid resource leaks
  }

  /**
   * Access to raw database operations (bypassing tenant auto-scoping).
   * Useful for administrative or cross-tenant tasks.
   */
  get raw() {
    return this.prismaClient;
  }
}
