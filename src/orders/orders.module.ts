import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from 'src/client/client.module';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { ContractController } from './controllers/contract.controller';
import { ContractService } from './services/contract.service';
import { RepositoryModule } from './repository/repository.module';
import { LandService } from 'src/sales/services/land.service';

@Module({
  controllers: [CustomerController, ContractController],
  imports: [RepositoryModule, ClientModule, JwtModule],
  providers: [CustomerService, ContractService, LandService],
})
export class OrderModule {}
