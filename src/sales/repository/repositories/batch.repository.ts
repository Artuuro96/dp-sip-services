import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { Batch, BatchDocument } from '../schemas/batch.schema';

export class BatchRepository {
  constructor(
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
  ) {}
  async create(batch: Batch): Promise<Batch> {
    return this.batchModel.create(batch);
  }

  async find(findOptiopns): Promise<Batch[]> {
    const { query, projection, options } = findOptiopns;
    const batchFind = this.batchModel.find(query);
    if (!isNil(projection)) batchFind.projection(projection);
    if (isNil(options)) return batchFind;

    const { limit, skip } = options;
    if (!isNil(limit)) batchFind.limit(limit);
    if (!isNil(skip)) batchFind.skip(skip);

    return batchFind;
  }

  async count(query): Promise<number> {
    return this.batchModel.count(query);
  }

  async findById(batchId, projection?): Promise<Batch> {
    return this.batchModel.findById(batchId, projection);
  }

  async updateOne(batch): Promise<Batch> {
    return this.batchModel.findOneAndUpdate({ _id: batch._id }, batch, {
      new: true,
    });
  }
}
