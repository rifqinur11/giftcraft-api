"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentTenantId = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_1 = require("./tenant.context");
exports.CurrentTenantId = (0, common_1.createParamDecorator)((data, ctx) => {
    const store = tenant_context_1.tenantLocalStorage.getStore();
    if (!store || !store.tenantId) {
        throw new common_1.BadRequestException('Active tenant context is required.');
    }
    return store.tenantId;
});
//# sourceMappingURL=tenant-id.decorator.js.map