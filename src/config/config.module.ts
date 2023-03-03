import { Module } from '@nestjs/common';
import { AcmaClient } from 'src/client/acma.client';
import { ConfigService } from './config.service';

@Module({
  providers: [
    AcmaClient,
    {
      provide: ConfigService,
      useValue: new ConfigService(),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
