import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { UpstreamHttpService } from "../common/services/upstream-http.service";
export declare class UsersController {
    private readonly configService;
    private readonly upstreamHttpService;
    constructor(configService: ConfigService, upstreamHttpService: UpstreamHttpService);
    register(request: Request, response: Response): Promise<void>;
    login(request: Request, response: Response): Promise<void>;
    getUsers(request: Request, response: Response): Promise<void>;
    private get userServiceUrl();
}
