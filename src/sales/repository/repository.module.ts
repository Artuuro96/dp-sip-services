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
import { ConfigService } from 'src/config/config.service';

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

const config = new ConfigService();

@Module({
  imports: [
    MongooseModule.forRoot(config.get('MONGODB_URI'), {
      dbName: config.get('MONGODB_NAME'),
    }),
    MongooseModule.forFeature(schemas),
  ],
  exports: [CreditRepository, BatchRepository, LandRepository, ContractRepository],
  providers: [CreditRepository, BatchRepository, LandRepository, ContractRepository],
})
export class RepositoryModule {}
