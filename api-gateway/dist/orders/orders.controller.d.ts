import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { UpstreamHttpService } from "../common/services/upstream-http.service";
export declare class OrdersController {
    private readonly configService;
    private readonly upstreamHttpService;
    constructor(configService: ConfigService, upstreamHttpService: UpstreamHttpService);
    createOrder(request: Request, response: Response): Promise<void>;
    getOrders(request: Request, response: Response): Promise<void>;
    getOrderById(id: string, request: Request, response: Response): Promise<void>;
    updateOrder(id: string, request: Request, response: Response): Promise<void>;
    private get orderServiceUrl();
}
