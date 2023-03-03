import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { AcmaClient } from './acma.client';

@Module({
  providers: [AcmaClient],
  imports: [ConfigModule],
  exports: [AcmaClient],
})
export class ClientModule {}
