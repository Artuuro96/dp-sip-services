import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditRepository } from './repositories/credit.repository';
import { LandRepository } from './repositories/land.repository';
import { BatchRepository } from './repositories/batch.repository';
import { Credit, CreditSchema } from './schemas/credit.schema';
import { Land, LandSchema } from './schemas/land.schema';
import { Batch, BatchSchema } from './schemas/batch.schema';
import { ContractRepository } from '../../orders/repository/repositories/contract.repository';
import { Contract, ContractSchema } from '../../orders/repository/schemas/contract.schema';

const schemas = [
  {
    name: Credit.name,
    schema: CreditSchema,
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
    name: Contract.name,
    schema: ContractSchema,
  },
];

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017'), MongooseModule.forFeature(schemas)],
  exports: [CreditRepository, BatchRepository, LandRepository, ContractRepository],
  providers: [CreditRepository, BatchRepository, LandRepository, ContractRepository],
})
export class RepositoryModule {}
