import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { Credit, CreditDocument } from '../schemas/credit.schema';

export class CreditRepository {
  constructor(
    @InjectModel(Credit.name) private creditModel: Model<CreditDocument>,
  ) {}

  async create(credit: Credit): Promise<Credit> {
    return this.creditModel.create(credit);
  }

  async find(findOptiopns): Promise<Credit[]> {
    const { query, projection, options } = findOptiopns;
    const creditFind = this.creditModel.find(query);
    if (!isNil(projection)) creditFind.projection(projection);
    if (isNil(options)) return creditFind;

    const { limit, skip } = options;
    if (!isNil(limit)) creditFind.limit(limit);
    if (!isNil(skip)) creditFind.skip(skip);

    return creditFind;
  }
  f;
  async count(query): Promise<number> {
    return this.creditModel.count(query);
  }

  async findById(creditId, projection?): Promise<Credit> {
    return this.creditModel.findById(creditId, projection);
  }

  async updateOne(credit): Promise<Credit> {
    return this.creditModel.findOneAndUpdate({ _id: credit._id }, credit, {
      new: true,
    });
  }
}