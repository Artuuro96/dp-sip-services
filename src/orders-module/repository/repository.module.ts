import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractRepository } from './repositories/contract.repository';
import { CustomerRepository } from './repositories/customer.repository';
import { PaymentRepository } from './repositories/payment.repository';
import { Contract, ContractSchema } from './schemas/contract.schema';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';

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
];

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    MongooseModule.forFeature(schemas),
  ],
  exports: [ContractRepository, CustomerRepository, PaymentRepository],
  providers: [ContractRepository, CustomerRepository, PaymentRepository],
})
export class RepositoryModule {}
