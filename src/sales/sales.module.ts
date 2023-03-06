import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from 'src/client/client.module';
import { BatchController } from './controllers/batch.controller';
import { LandController } from './controllers/land.controller';
import { CreditController } from './controllers/credit.controller';
import { RepositoryModule } from './repository/repository.module';
import { BatchService } from './services/batch.service';
import { CreditService } from './services/credit.service';
import { LandService } from './services/land.service';

@Module({
  controllers: [BatchController, CreditController, LandController],
  imports: [RepositoryModule, ClientModule, JwtModule],
  providers: [LandService, CreditService, BatchService],
})
export class SaleModule {}
