import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";

import { Public } from "../common/decorators/public.decorator";
import { UpstreamHttpService } from "../common/services/upstream-http.service";

@Controller("api/users")
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly upstreamHttpService: UpstreamHttpService,
  ) {}

  @Public()
  @Post("register")
  async register(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.userServiceUrl,
      targetPath: "/api/users/register",
    });
  }

  @Public()
  @Post("login")
  async login(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.userServiceUrl,
      targetPath: "/api/users/login",
    });
  }

  @Public()
  @Post("refresh")
  async refresh(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.userServiceUrl,
      targetPath: "/api/users/refresh",
    });
  }

  @Post("logout")
  async logout(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.userServiceUrl,
      targetPath: "/api/users/logout",
    });
  }

  @Get()
  async getUsers(@Req() request: Request, @Res() response: Response) {
    await this.upstreamHttpService.forward({
      request,
      response,
      targetBaseUrl: this.userServiceUrl,
      targetPath: "/api/users",
    });
  }

  private get userServiceUrl(): string {
    return this.configService.getOrThrow<string>("USER_SERVICE_URL");
  }
}
