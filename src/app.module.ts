import { Module } from '@nestjs/common';
import { OrderModule } from './orders-module/orders.module';
import { SaleModule } from './sales-module/sales.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { Config } from './config/config.keys';

@Module({
  imports: [ConfigModule, OrderModule, SaleModule],
  providers: [ConfigService],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get(Config.PORT);
  }
}
