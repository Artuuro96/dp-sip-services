import { Controller, Get } from '@nestjs/common';
import { HealthCheckResponse } from 'src/interfaces/health-check.interface';

@Controller('/health')
export class HealthCheckController {
  @Get()
  async checkHealth(): Promise<HealthCheckResponse> {
    return {
      status: 'up',
      version: '1.0.0',
    };
  }
}
