import { Controller, Get } from "@nestjs/common";

import { Public } from "../common/decorators/public.decorator";

@Controller("health")
export class HealthController {
  @Public()
  @Get()
  checkHealth() {
    return {
      status: "OK",
      service: "api-gateway",
      timestamp: new Date().toISOString(),
    };
  }
}
