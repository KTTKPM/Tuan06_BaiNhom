import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { UpstreamHttpService } from "../common/services/upstream-http.service";
type PaymentRequestBody = {
    orderId: number | string;
    method?: string;
    paymentMethod?: string;
    customerName?: string;
    userId?: number | string;
};
export declare class PaymentsController {
    private readonly configService;
    private readonly upstreamHttpService;
    constructor(configService: ConfigService, upstreamHttpService: UpstreamHttpService);
    createPayment(body: PaymentRequestBody, request: Request, response: Response): Promise<void>;
    getHistory(request: Request, response: Response): Promise<void>;
    getPaymentsHistory(request: Request, response: Response): Promise<void>;
    private resolveCustomerName;
    private get paymentServiceUrl();
}
export {};
