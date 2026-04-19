import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

import { UpstreamHttpService } from "../common/services/upstream-http.service";

type PaymentRequestBody = {
  orderId: number | string;
  method?: string;
  paymentMethod?: string;
  customerName?: string;
  userId?: number | string;
};

type RequestWithUser = Request & {
  user?: {
    username?: string;
  };
};

@Controller("api")
export class PaymentsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly upstreamHttpService: UpstreamHttpService,
  ) {}

  @Post("payments")
  async createPayment(
    @Body() body: PaymentRequestBody,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const normalizedBody = {
      ...body,
      paymentMethod: body.paymentMethod ?? body.method,
      customerName:
        body.customerName ?? this.resolveCustomerName(request, body),
    };

    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.paymentServiceUrl,
      targetPath: "/api/payments",
      body: normalizedBody,
    });
  }

  @Get("history")
  async getHistory(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.paymentServiceUrl,
      targetPath: "/api/history",
    });
  }

  @Get("payments/history")
  async getPaymentsHistory(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.paymentServiceUrl,
      targetPath: "/api/history",
    });
  }

  private resolveCustomerName(
    request: Request,
    body: PaymentRequestBody,
  ): string {
    const requestWithUser = request as RequestWithUser;

    if (typeof body.userId !== "undefined") {
      return String(body.userId);
    }

    if (
      requestWithUser.user &&
      typeof requestWithUser.user === "object" &&
      requestWithUser.user.username
    ) {
      return String(requestWithUser.user.username);
    }

    return "Unknown";
  }

  private get paymentServiceUrl(): string {
    return this.configService.getOrThrow<string>("PAYMENT_SERVICE_URL");
  }
}
