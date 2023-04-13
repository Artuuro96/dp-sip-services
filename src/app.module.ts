import { Module } from '@nestjs/common';
import { OrderModule } from './orders/orders.module';
import { SaleModule } from './sales/sales.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [ConfigModule, OrderModule, SaleModule, AnalyticsModule],
  providers: [ConfigService],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly config: ConfigService) {
    AppModule.port = this.config.get('PORT');
  }
}
