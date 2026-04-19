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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const upstream_http_service_1 = require("../common/services/upstream-http.service");
let OrdersController = class OrdersController {
    constructor(configService, upstreamHttpService) {
        this.configService = configService;
        this.upstreamHttpService = upstreamHttpService;
    }
    async createOrder(request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.orderServiceUrl,
            targetPath: "/order",
        });
    }
    async getOrders(request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.orderServiceUrl,
            targetPath: "/order",
        });
    }
    async getOrderById(id, request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.orderServiceUrl,
            targetPath: `/order/${id}`,
        });
    }
    async updateOrder(id, request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.orderServiceUrl,
            targetPath: `/order/${id}`,
        });
    }
    get orderServiceUrl() {
        return this.configService.getOrThrow("ORDER_SERVICE_URL");
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)("api/orders"),
    __metadata("design:paramtypes", [config_1.ConfigService,
        upstream_http_service_1.UpstreamHttpService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map