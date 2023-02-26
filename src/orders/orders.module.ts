import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { RepositoryModule } from './repository/repository.module';
import { CustomerService } from './services/customer.service';

@Module({
  controllers: [CustomerController],
  imports: [RepositoryModule],
  providers: [CustomerService],
})
export class OrderModule {}
