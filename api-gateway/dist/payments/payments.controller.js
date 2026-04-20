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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const upstream_http_service_1 = require("../common/services/upstream-http.service");
let PaymentsController = class PaymentsController {
    constructor(configService, upstreamHttpService) {
        this.configService = configService;
        this.upstreamHttpService = upstreamHttpService;
    }
    async createPayment(body, request, response) {
        const normalizedBody = {
            ...body,
            paymentMethod: body.paymentMethod ?? body.method,
            customerName: body.customerName ?? this.resolveCustomerName(request, body),
        };
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.paymentServiceUrl,
            targetPath: "/api/payments",
            body: normalizedBody,
        });
    }
    async getHistory(request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.paymentServiceUrl,
            targetPath: "/api/history",
        });
    }
    async getPaymentsHistory(request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.paymentServiceUrl,
            targetPath: "/api/history",
        });
    }
    resolveCustomerName(request, body) {
        const requestWithUser = request;
        if (typeof body.userId !== "undefined") {
            return String(body.userId);
        }
        if (requestWithUser.user &&
            typeof requestWithUser.user === "object" &&
            requestWithUser.user.username) {
            return String(requestWithUser.user.username);
        }
        return "Unknown";
    }
    get paymentServiceUrl() {
        return this.configService.getOrThrow("PAYMENT_SERVICE_URL");
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)("payments"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)("history"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)("payments/history"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPaymentsHistory", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)("api"),
    __metadata("design:paramtypes", [config_1.ConfigService,
        upstream_http_service_1.UpstreamHttpService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map