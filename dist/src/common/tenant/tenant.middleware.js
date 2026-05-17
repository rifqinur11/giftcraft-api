"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_1 = require("./tenant.context");
let TenantMiddleware = class TenantMiddleware {
    use(req, res, next) {
        const tenantId = req.headers['x-tenant-id'];
        const bypassPaths = ['/auth/login', '/auth/register', '/health'];
        const isBypass = req.originalUrl === '/' || bypassPaths.some((path) => req.originalUrl.startsWith(path));
        if (!tenantId && !isBypass) {
            throw new common_1.BadRequestException('x-tenant-id header is required');
        }
        if (tenantId) {
            tenant_context_1.tenantLocalStorage.run({ tenantId }, () => {
                next();
            });
        }
        else {
            next();
        }
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)()
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map