import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientModule } from 'src/client/client.module';
import { BatchController } from './controllers/batch.controller';
import { LandController } from './controllers/land.controller';
import { RepositoryModule } from './repository/repository.module';
import { BatchService } from './services/batch.service';
import { LandService } from './services/land.service';

@Module({
  controllers: [BatchController, LandController],
  imports: [RepositoryModule, ClientModule, JwtModule],
  providers: [LandService, BatchService],
})
export class SaleModule {}
