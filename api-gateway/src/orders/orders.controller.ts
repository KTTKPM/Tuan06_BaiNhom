import { Controller, Get, Param, Post, Put, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

import { UpstreamHttpService } from "../common/services/upstream-http.service";

@Controller("api/orders")
export class OrdersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly upstreamHttpService: UpstreamHttpService,
  ) {}

  @Post()
  async createOrder(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.orderServiceUrl,
      targetPath: "/order",
    });
  }

  @Get()
  async getOrders(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.orderServiceUrl,
      targetPath: "/order",
    });
  }

  @Get(":id")
  async getOrderById(
    @Param("id") id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.orderServiceUrl,
      targetPath: `/order/${id}`,
    });
  }

  @Put(":id")
  async updateOrder(
    @Param("id") id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.orderServiceUrl,
      targetPath: `/order/${id}`,
    });
  }

  private get orderServiceUrl(): string {
    return this.configService.getOrThrow<string>("ORDER_SERVICE_URL");
  }
}
