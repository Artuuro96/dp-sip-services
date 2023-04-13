import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales')
  async countSales(@Query() countSalesQueryDTO: any): Promise<any> {
    return await this.analyticsService.countSales(countSalesQueryDTO);
  }

  @Get('land/status')
  async getLandStatus(): Promise<any> {
    return await this.analyticsService.getLandStatus();
  }
}
