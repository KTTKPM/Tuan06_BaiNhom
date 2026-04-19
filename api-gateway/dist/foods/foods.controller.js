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
exports.FoodsController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const upstream_http_service_1 = require("../common/services/upstream-http.service");
let FoodsController = class FoodsController {
    constructor(configService, upstreamHttpService) {
        this.configService = configService;
        this.upstreamHttpService = upstreamHttpService;
    }
    async getFoods(request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.foodServiceUrl,
            targetPath: "/api/foods",
        });
    }
    async getFoodById(id, request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.foodServiceUrl,
            targetPath: `/api/foods/${id}`,
        });
    }
    async createFood(request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.foodServiceUrl,
            targetPath: "/api/foods",
        });
    }
    async updateFood(id, request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.foodServiceUrl,
            targetPath: `/api/foods/${id}`,
        });
    }
    async deleteFood(id, request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.foodServiceUrl,
            targetPath: `/api/foods/${id}`,
        });
    }
    get foodServiceUrl() {
        return this.configService.getOrThrow("FOOD_SERVICE_URL");
    }
};
exports.FoodsController = FoodsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FoodsController.prototype, "getFoods", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FoodsController.prototype, "getFoodById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FoodsController.prototype, "createFood", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FoodsController.prototype, "updateFood", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FoodsController.prototype, "deleteFood", null);
exports.FoodsController = FoodsController = __decorate([
    (0, common_1.Controller)("api/foods"),
    __metadata("design:paramtypes", [config_1.ConfigService,
        upstream_http_service_1.UpstreamHttpService])
], FoodsController);
//# sourceMappingURL=foods.controller.js.map