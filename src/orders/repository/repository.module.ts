import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractRepository } from './repositories/contract.repository';
import { CustomerRepository } from './repositories/customer.repository';
import { PaymentRepository } from './repositories/payment.repository';
import { LandRepository } from '../../sales/repository/repositories/land.repository';
import { BatchRepository } from '../../sales/repository/repositories/batch.repository';

import { Contract, ContractSchema } from './schemas/contract.schema';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Land, LandSchema } from '../../sales/repository/schemas/land.schema';
import { Batch, BatchSchema } from '../../sales/repository/schemas/batch.schema';
import { ConfigService } from 'src/config/config.service';
import { CreditRepository } from 'src/sales/repository/repositories/credit.repository';
import { Credit, CreditSchema } from 'src/sales/repository/schemas/credit.schema';

const schemas = [
  {
    name: Customer.name,
    schema: CustomerSchema,
  },
  {
    name: Contract.name,
    schema: ContractSchema,
  },
  {
    name: Payment.name,
    schema: PaymentSchema,
  },
  {
    name: Land.name,
    schema: LandSchema,
  },
  {
    name: Batch.name,
    schema: BatchSchema,
  },
  {
    name: Credit.name,
    schema: CreditSchema,
  },
];

const config = new ConfigService();

@Module({
  imports: [
    MongooseModule.forRoot(config.get('MONGODB_URI'), { dbName: config.get('MONGODB_NAME') }),
    MongooseModule.forFeature(schemas),
  ],
  exports: [
    BatchRepository,
    ContractRepository,
    CustomerRepository,
    PaymentRepository,
    LandRepository,
    CreditRepository,
  ],
  providers: [
    BatchRepository,
    ContractRepository,
    CustomerRepository,
    PaymentRepository,
    LandRepository,
    CreditRepository,
  ],
})
export class RepositoryModule {}
