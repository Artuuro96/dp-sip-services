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
];

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017'), MongooseModule.forFeature(schemas)],
  exports: [BatchRepository, ContractRepository, CustomerRepository, PaymentRepository, LandRepository],
  providers: [BatchRepository, ContractRepository, CustomerRepository, PaymentRepository, LandRepository],
})
export class RepositoryModule {}
