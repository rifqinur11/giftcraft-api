"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const tenant_context_1 = require("../common/tenant/tenant.context");
let PrismaService = class PrismaService {
    prismaClient;
    pool;
    db;
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
        });
        const adapter = new adapter_pg_1.PrismaPg(this.pool);
        this.prismaClient = new client_1.PrismaClient({
            adapter,
            log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        });
        const tenantScopedModels = ['User', 'Product', 'Invoice'];
        this.db = this.prismaClient.$extends({
            query: {
                $allModels: {
                    async $allOperations({ model, operation, args, query }) {
                        if (tenantScopedModels.includes(model)) {
                            const store = tenant_context_1.tenantLocalStorage.getStore();
                            const tenantId = store?.tenantId;
                            if (tenantId) {
                                const anyArgs = args;
                                if ([
                                    'findFirst',
                                    'findFirstOrThrow',
                                    'findMany',
                                    'count',
                                    'aggregate',
                                    'groupBy',
                                ].includes(operation)) {
                                    anyArgs.where = { ...anyArgs.where, tenantId };
                                }
                                if (['update', 'updateMany', 'upsert', 'delete', 'deleteMany'].includes(operation)) {
                                    anyArgs.where = { ...anyArgs.where, tenantId };
                                }
                                if (operation === 'create') {
                                    anyArgs.data = { ...anyArgs.data, tenantId };
                                }
                                else if (operation === 'createMany') {
                                    if (Array.isArray(anyArgs.data)) {
                                        anyArgs.data = anyArgs.data.map((item) => ({
                                            ...item,
                                            tenantId,
                                        }));
                                    }
                                    else if (anyArgs.data) {
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
        await this.pool.end();
    }
    get raw() {
        return this.prismaClient;
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map