import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from 'src/client/client.module';
import { CustomerController } from './controllers/customer.controller';
import { RepositoryModule } from './repository/repository.module';
import { CustomerService } from './services/customer.service';

@Module({
  controllers: [CustomerController],
  imports: [RepositoryModule, ClientModule, JwtModule],
  providers: [CustomerService],
})
export class OrderModule {}
