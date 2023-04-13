import { Injectable } from '@nestjs/common';
import { CreditService } from 'src/sales/services/credit.service';
import { ContractService } from './contract.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly creditService: CreditService,
  ) {}

  async countSales(countSalesQueryDTO: any): Promise<any> {
    return await this.creditService.countSales();
  }

  async getLandStatus(): Promise<any> {
    return;
  }
}
