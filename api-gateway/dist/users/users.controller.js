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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const public_decorator_1 = require("../common/decorators/public.decorator");
const upstream_http_service_1 = require("../common/services/upstream-http.service");
let UsersController = class UsersController {
    constructor(configService, upstreamHttpService) {
        this.configService = configService;
        this.upstreamHttpService = upstreamHttpService;
    }
    async register(request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.userServiceUrl,
            targetPath: "/api/users/register",
        });
    }
    async login(request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.userServiceUrl,
            targetPath: "/api/users/login",
        });
    }
    async getUsers(request, response) {
        await this.upstreamHttpService.forward({
            request,
            response,
            targetBaseUrl: this.userServiceUrl,
            targetPath: "/api/users",
        });
    }
    get userServiceUrl() {
        return this.configService.getOrThrow("USER_SERVICE_URL");
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)("api/users"),
    __metadata("design:paramtypes", [config_1.ConfigService,
        upstream_http_service_1.UpstreamHttpService])
], UsersController);
//# sourceMappingURL=users.controller.js.map