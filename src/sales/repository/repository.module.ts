import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditRepository } from './repositories/credit.repository';
import { LandRepository } from './repositories/land.repository';
import { BatchRepository } from './repositories/batch.repository';
import { Credit, CreditSchema } from './schemas/credit.schema';
import { Land, LandSchema } from './schemas/land.schema';
import { Batch, BatchSchema } from './schemas/batch.schema';

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
];

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    MongooseModule.forFeature(schemas),
  ],
  exports: [CreditRepository, BatchRepository, LandRepository],
  providers: [CreditRepository, BatchRepository, LandRepository],
})
export class RepositoryModule {}
