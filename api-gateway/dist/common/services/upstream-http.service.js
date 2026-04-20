"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpstreamHttpService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let UpstreamHttpService = class UpstreamHttpService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async forward(options) {
        const { request, response, targetBaseUrl, targetPath, body } = options;
        const url = this.buildTargetUrl(targetBaseUrl, targetPath);
        try {
            const upstreamResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.request({
                url,
                method: request.method.toLowerCase(),
                params: request.query,
                data: body ?? request.body,
                headers: this.extractForwardHeaders(request),
                timeout: 10000,
                validateStatus: () => true,
            }));
            const contentType = upstreamResponse.headers["content-type"];
            if (contentType) {
                response.setHeader("content-type", contentType);
            }
            const setCookieHeaders = upstreamResponse.headers["set-cookie"];
            if (setCookieHeaders) {
                response.setHeader("set-cookie", setCookieHeaders);
            }
            response.status(upstreamResponse.status).send(upstreamResponse.data);
            return;
        }
        catch (error) {
            if (typeof error === "object" && error && "code" in error) {
                throw new common_1.ServiceUnavailableException({
                    message: "Upstream service unavailable",
                    target: targetBaseUrl,
                    code: String(error.code ?? "UNKNOWN"),
                });
            }
            throw new common_1.BadGatewayException({
                message: "Gateway forwarding failed",
                target: targetBaseUrl,
            });
        }
    }
    buildTargetUrl(baseUrl, path) {
        const normalizedBase = baseUrl.endsWith("/")
            ? baseUrl.slice(0, -1)
            : baseUrl;
        const normalizedPath = path.startsWith("/") ? path : `/${path}`;
        return `${normalizedBase}${normalizedPath}`;
    }
    extractForwardHeaders(request) {
        const headers = {};
        for (const [key, value] of Object.entries(request.headers)) {
            if (!value ||
                key === "host" ||
                key === "connection" ||
                key === "content-length") {
                continue;
            }
            if (Array.isArray(value)) {
                headers[key] = value.join(",");
            }
            else {
                headers[key] = value;
            }
        }
        return headers;
    }
};
exports.UpstreamHttpService = UpstreamHttpService;
exports.UpstreamHttpService = UpstreamHttpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], UpstreamHttpService);
//# sourceMappingURL=upstream-http.service.js.map