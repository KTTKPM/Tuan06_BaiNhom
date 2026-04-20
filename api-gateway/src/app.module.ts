import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";

import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { UpstreamHttpService } from "./common/services/upstream-http.service";
import { FoodsController } from "./foods/foods.controller";
import { HealthController } from "./health/health.controller";
import { OrdersController } from "./orders/orders.controller";
import { PaymentsController } from "./payments/payments.controller";
import { UsersController } from "./users/users.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
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
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
      }),
      global: true,
    }),
    HttpModule,
  ],
  controllers: [
    HealthController,
    UsersController,
    FoodsController,
    OrdersController,
    PaymentsController,
  ],
  providers: [
    UpstreamHttpService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
