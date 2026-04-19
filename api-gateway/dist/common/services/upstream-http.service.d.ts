import { HttpService } from "@nestjs/axios";
import { Request, Response } from "express";
export type ForwardRequestOptions = {
    request: Request;
    response: Response;
    targetBaseUrl: string;
    targetPath: string;
    body?: unknown;
};
export declare class UpstreamHttpService {
    private readonly httpService;
    constructor(httpService: HttpService);
    forward(options: ForwardRequestOptions): Promise<void>;
    private buildTargetUrl;
    private extractForwardHeaders;
}
