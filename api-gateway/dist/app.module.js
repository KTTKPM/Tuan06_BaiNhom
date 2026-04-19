"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const upstream_http_service_1 = require("./common/services/upstream-http.service");
const foods_controller_1 = require("./foods/foods.controller");
const health_controller_1 = require("./health/health.controller");
const orders_controller_1 = require("./orders/orders.controller");
const payments_controller_1 = require("./payments/payments.controller");
const users_controller_1 = require("./users/users.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: (env) => {
                    const requiredKeys = [
                        "USER_SERVICE_URL",
                        "FOOD_SERVICE_URL",
                        "ORDER_SERVICE_URL",
                        "PAYMENT_SERVICE_URL",
                        "JWT_SECRET",
                    ];
                    for (const key of requiredKeys) {
                        if (!env[key]) {
                            throw new Error(`Missing required environment variable: ${key}`);
                        }
                    }
                    return env;
                },
            }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get("JWT_SECRET"),
                }),
                global: true,
            }),
            axios_1.HttpModule,
        ],
        controllers: [
            health_controller_1.HealthController,
            users_controller_1.UsersController,
            foods_controller_1.FoodsController,
            orders_controller_1.OrdersController,
            payments_controller_1.PaymentsController,
        ],
        providers: [
            upstream_http_service_1.UpstreamHttpService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map