export class GeneralSuccessDto {
    statusCode?: string;
    message?: string;
    data?: any;
    meta?: any;

    constructor(statusCode?: string, message?: string, data?: any, meta?: any) {
        this.statusCode = statusCode ?? undefined;
        this.message = message ?? undefined;
        this.data = data ?? undefined;
        this.meta = meta ?? undefined;
    }
}