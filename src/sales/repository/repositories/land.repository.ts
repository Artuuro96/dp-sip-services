import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { Land, LandDocument } from '../schemas/land.schema';

export class LandRepository {
  constructor(@InjectModel(Land.name) private landModel: Model<LandDocument>) {}
  async create(land: Land): Promise<Land> {
    return this.landModel.create(land);
  }

  async find(findOptiopns): Promise<Land[]> {
    const { query, projection, options } = findOptiopns;
    const landFind = this.landModel.find(query);
    if (!isNil(projection)) landFind.projection(projection);
    if (isNil(options)) return landFind;

    const { limit, skip } = options;
    if (!isNil(limit)) landFind.limit(limit);
    if (!isNil(skip)) landFind.skip(skip);

    return landFind;
  }

  async count(query): Promise<number> {
    return await this.landModel.count(query);
  }

  async findById(landId, projection?): Promise<Land> {
    return await this.landModel.findById(landId, projection);
  }

  async findOne(query, projection?): Promise<Land> {
    return await this.landModel.findOne(query, projection);
  }

  async updateOne(land): Promise<Land> {
    return await this.landModel.findOneAndUpdate({ _id: land._id }, land, {
      new: true,
    });
  }
}
