import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { UpstreamHttpService } from "../common/services/upstream-http.service";
export declare class FoodsController {
    private readonly configService;
    private readonly upstreamHttpService;
    constructor(configService: ConfigService, upstreamHttpService: UpstreamHttpService);
    getFoods(request: Request, response: Response): Promise<void>;
    getFoodById(id: string, request: Request, response: Response): Promise<void>;
    createFood(request: Request, response: Response): Promise<void>;
    updateFood(id: string, request: Request, response: Response): Promise<void>;
    deleteFood(id: string, request: Request, response: Response): Promise<void>;
    private get foodServiceUrl();
}
