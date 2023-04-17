import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from 'src/client/client.module';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { ContractController } from './controllers/contract.controller';
import { ContractService } from './services/contract.service';
import { RepositoryModule } from './repository/repository.module';
import { LandService } from 'src/sales/services/land.service';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { AnalyticsController } from './controllers/analytics.controller';
import { AnalyticsService } from './services/analytics.service';
import { CreditService } from 'src/sales/services/credit.service';
import { HealthCheckController } from './controllers/health-check.controller';

@Module({
  controllers: [
    CustomerController,
    ContractController,
    PaymentController,
    AnalyticsController,
    HealthCheckController,
  ],
  imports: [RepositoryModule, ClientModule, JwtModule],
  providers: [CustomerService, ContractService, LandService, PaymentService, AnalyticsService, CreditService],
})
export class OrderModule {}
