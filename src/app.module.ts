import { Logger, Module } from '@nestjs/common';
import { OrderModule } from './orders/orders.module';
import { SaleModule } from './sales/sales.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [ConfigModule, OrderModule, SaleModule],
  providers: [ConfigService, Logger],
})
export class AppModule {
  static port: number | string;

  constructor(private readonly config: ConfigService) {
    AppModule.port = this.config.get('PORT');
  }
}
