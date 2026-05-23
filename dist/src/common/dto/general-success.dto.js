"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralSuccessDto = void 0;
class GeneralSuccessDto {
    statusCode;
    message;
    data;
    meta;
    constructor(statusCode, message, data, meta) {
        this.statusCode = statusCode ?? undefined;
        this.message = message ?? undefined;
        this.data = data ?? undefined;
        this.meta = meta ?? undefined;
    }
}
exports.GeneralSuccessDto = GeneralSuccessDto;
//# sourceMappingURL=general-success.dto.js.map