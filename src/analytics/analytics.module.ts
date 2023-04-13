import { Module } from '@nestjs/common';
import { AnalyticsController } from 'src/orders/controllers/analytics.controller';
import { RepositoryModule } from 'src/orders/repository/repository.module';
import { AnalyticsService } from 'src/orders/services/analytics.service';
import { CreditService } from 'src/sales/services/credit.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, CreditService],
  imports: [RepositoryModule],
})
export class AnalyticsModule {}
