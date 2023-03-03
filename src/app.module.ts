import { Module } from '@nestjs/common';
import { OrderModule } from './orders/orders.module';
import { SaleModule } from './sales/sales.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule,
    OrderModule,
    SaleModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            messageKey: 'message',
          },
        },
        messageKey: 'message',
      },
    }),
  ],
  providers: [ConfigService],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly config: ConfigService) {
    AppModule.port = this.config.get('PORT');
  }
}
