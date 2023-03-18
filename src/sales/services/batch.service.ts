import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BatchRepository } from '../repository/repositories/batch.repository';
import { LandRepository } from '../repository/repositories/land.repository';
import { LandService } from './land.service';
import { Batch } from '../repository/schemas/batch.schema';
import { PaginateResult } from '../../interfaces/paginate-result.interface';
import { BatchDTO } from '../dtos/batch.dto';
import { isNil } from 'lodash';
import { Context } from 'src/auth/context/execution-ctx';

@Injectable()
export class BatchService {
  constructor(
    private batchRepository: BatchRepository,
    private landRepository: LandRepository,
    private landService: LandService,
  ) {}

  /**
   * @name create
   * @param {object} batch Object batch to create
   * @description Creates a batch
   * @returns {Object} Returns the batch
   */
  async create(executionCtx: Context, batch: BatchDTO): Promise<Batch> {
    const newBatch: Batch = {
      ...batch,
      createdBy: executionCtx.userId,
    };

    const batchCreated = await this.batchRepository.create(newBatch);
    if (!isNil(batchCreated.landIds)) {
      await this.updateLand(executionCtx, batchCreated._id, batchCreated.landIds);
    }

    return batchCreated;
  }

  /**
   * @name findById
   * @param {string} batchId Id from the batch
   * @description Finds a batch with his ID
   * @returns {Object} Returns the batch found
   */
  async findById(batchId): Promise<Batch> {
    const batchFound = await this.batchRepository.findById(batchId);
    if (isNil(batchFound)) throw new NotFoundException('batch not found');
    if (batchFound.deleted) throw new NotFoundException('batch not found');
    return batchFound;
  }

  /**
   * @name findAll
   * @param {string} keyValue Value that we need to search
   * @param {number} skip Page of the paginate
   * @param  {number} limit Limit of the document result
   * @description Find all the batch paginated
   * @returns {PaginateResult} Object with the batch paginate
   */
  async findAll(keyValue = '', skip = 0, limit?: number): Promise<PaginateResult> {
    skip = Number(skip);
    limit = Number(limit);
    const options = {
      skip: skip > 0 ? skip - 1 : skip,
      limit,
    };

    //need to find the way of doing a variable search
    const query = {
      name: new RegExp(`${keyValue}`, 'i'),
    };

    const batchs = await this.batchRepository.find({ query, options });
    const countbatchs = await this.batchRepository.count(query);
    return {
      result: batchs,
      total: countbatchs,
      page: skip,
      pages: Math.ceil(countbatchs / limit),
    };
  }

  /**
   * @name update
   * @param {Object} batch Object batch to update
   * @description Update the batch
   * @returns {Object} Returns the batch updated
   */
  async update(executionCtx: Context, batch, batchId): Promise<Batch> {
    const batchFound = await this.batchRepository.findById(batchId, {
      _id: 1,
      deleted: 1,
      landIds: 1,
    });

    if (batch.landIds && batch.landIds.length > 0) {
      for (const landId of batch.landIds) {
        const landsIdFound = batchFound.landIds.map((id) => id.toString());
        if (!landsIdFound.includes(landId)) {
          const landFound = await this.landRepository.findById(landId);
          if (isNil(landFound)) throw new NotFoundException('Batch not found');
          if (landFound.deleted) throw new NotFoundException('Batch not found');
        }
      }
    }

    if (isNil(batchFound)) throw new NotFoundException('Batch not found');
    if (batchFound.deleted) throw new NotFoundException('Batch not found');

    batch._id = batchId;
    const batchUpdated = await this.batchRepository.updateOne(batch);
    if (!isNil(batchUpdated.landIds)) {
      await this.updateLand(executionCtx, batchFound._id, batchUpdated.landIds);
    }

    return batchUpdated;
  }

  /**
   * @name delete
   * @param {string} batchId Id from the batch
   * @description Deletes the batch but not remove from the DB
   * @returns {Object} Returns the result from the deletion
   */
  async delete(executionCtx: Context, batchId): Promise<Batch> {
    const batch = await this.batchRepository.findById(batchId, {
      _id: 1,
      deleted: 1,
      landIds: 1,
    });

    if (isNil(batch)) throw new NotFoundException('Batch not found');
    if (batch.deleted) throw new BadRequestException('Batch already deleted');

    if (!isNil(batch.landIds)) {
      batch.landIds.forEach((landId) => {
        this.landService.delete(executionCtx, landId);
      });
    }

    batch.deleted = true;
    batch.landIds = [];
    batch.updatedBy = executionCtx.userId;
    return this.batchRepository.updateOne(batch);
  }

  /**
   * @name updateLand
   * @param {string} batchId
   * @param {string[]} landIds
   * @description Update the land and his respective batches
   * @returns
   */
  async updateLand(excutionCtx: Context, batchId, landIds: string[]): Promise<void> {
    const findOptiopns = {
      query: {
        _id: { $in: landIds },
      },
      projection: {
        _id: 1,
        batchId: 1,
        deleted: 1,
      },
    };
    const landsFound = await this.landRepository.find(findOptiopns);

    for (const land of landsFound) {
      if (!isNil(land.batchId)) {
        await this.landService.deleteLandInBatch(land.batchId, land._id.toString());
      }
      land.batchId = batchId;
      land.updatedBy = excutionCtx.userId;
      await this.landRepository.updateOne(land);
    }
    return;
  }
}
