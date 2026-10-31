import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  public getHealthStatus(): {
    message: string;
    status: string;
    timestamp: string;
  } {
    return this.healthService.getHealthStatus();
  }
}
