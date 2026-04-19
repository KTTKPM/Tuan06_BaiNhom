import { HttpService } from "@nestjs/axios";
import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Method } from "axios";
import { Request, Response } from "express";
import { firstValueFrom } from "rxjs";

export type ForwardRequestOptions = {
  request: Request;
  response: Response;
  targetBaseUrl: string;
  targetPath: string;
  body?: unknown;
};

@Injectable()
export class UpstreamHttpService {
  constructor(private readonly httpService: HttpService) {}

  async forward(options: ForwardRequestOptions): Promise<void> {
    const { request, response, targetBaseUrl, targetPath, body } = options;

    const url = this.buildTargetUrl(targetBaseUrl, targetPath);

    try {
      const upstreamResponse = await firstValueFrom(
        this.httpService.request({
          url,
          method: request.method.toLowerCase() as Method,
          params: request.query,
          data: body ?? request.body,
          headers: this.extractForwardHeaders(request),
          timeout: 10000,
          validateStatus: () => true,
        }),
      );

      const contentType = upstreamResponse.headers["content-type"];
      if (contentType) {
        response.setHeader("content-type", contentType);
      }

      response.status(upstreamResponse.status).send(upstreamResponse.data);
      return;
    } catch (error) {
      if (typeof error === "object" && error && "code" in error) {
        throw new ServiceUnavailableException({
          message: "Upstream service unavailable",
          target: targetBaseUrl,
          code: String((error as { code?: unknown }).code ?? "UNKNOWN"),
        });
      }

      throw new BadGatewayException({
        message: "Gateway forwarding failed",
        target: targetBaseUrl,
      });
    }
  }

  private buildTargetUrl(baseUrl: string, path: string): string {
    const normalizedBase = baseUrl.endsWith("/")
      ? baseUrl.slice(0, -1)
      : baseUrl;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  private extractForwardHeaders(request: Request): Record<string, string> {
    const headers: Record<string, string> = {};

    for (const [key, value] of Object.entries(request.headers)) {
      if (
        !value ||
        key === "host" ||
        key === "connection" ||
        key === "content-length"
      ) {
        continue;
      }

      if (Array.isArray(value)) {
        headers[key] = value.join(",");
      } else {
        headers[key] = value;
      }
    }

    return headers;
  }
}
