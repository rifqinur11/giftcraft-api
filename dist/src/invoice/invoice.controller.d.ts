import { InvoiceService } from './invoice.service';
declare class CreateInvoiceDto {
    amount: number;
}
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    findAll(): Promise<any>;
    create(createInvoiceDto: CreateInvoiceDto): Promise<any>;
    findOne(id: string): Promise<any>;
    pay(id: string): Promise<any>;
}
export {};
