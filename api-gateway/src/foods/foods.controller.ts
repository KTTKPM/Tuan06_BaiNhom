import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

import { UpstreamHttpService } from "../common/services/upstream-http.service";

@Controller("api/foods")
export class FoodsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly upstreamHttpService: UpstreamHttpService,
  ) {}

  @Get()
  async getFoods(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.foodServiceUrl,
      targetPath: "/api/foods",
    });
  }

  @Get(":id")
  async getFoodById(
    @Param("id") id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.foodServiceUrl,
      targetPath: `/api/foods/${id}`,
    });
  }

  @Post()
  async createFood(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.foodServiceUrl,
      targetPath: "/api/foods",
    });
  }

  @Put(":id")
  async updateFood(
    @Param("id") id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.foodServiceUrl,
      targetPath: `/api/foods/${id}`,
    });
  }

  @Delete(":id")
  async deleteFood(
    @Param("id") id: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.foodServiceUrl,
      targetPath: `/api/foods/${id}`,
    });
  }

  private get foodServiceUrl(): string {
    return this.configService.getOrThrow<string>("FOOD_SERVICE_URL");
  }
}
