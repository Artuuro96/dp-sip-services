import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BatchRepository } from '../repository/repositories/batch.repository';
import { LandRepository } from '../repository/repositories/land.repository';
import { Address, Land } from '../repository/schemas/land.schema';
import { PaginateResult } from '../../interfaces/paginate-result.interface';
import { LandDTO } from '../dtos/land.dto';
import { isNil } from 'lodash';
import { Batch } from '../repository/schemas/batch.schema';
import { Context } from 'src/auth/context/execution-ctx';

@Injectable()
export class LandService {
  constructor(private landRepository: LandRepository, private batchRepository: BatchRepository) {}

  /**
   * @name create
   * @param {object} land Object land to create
   * @description Creates a land
   * @returns {Object} Returns the land
   */
  async create(executionCtx: Context, land: LandDTO): Promise<Land> {
    const { address } = land;

    if (!isNil(land.batchId)) {
      const projection = { _id: 1, delete: 1 };
      const batch: Batch = await this.batchRepository.findById(land.batchId, projection);
      if (isNil(batch)) throw new NotFoundException('Batch not found');
      if (batch.deleted) throw new NotFoundException('Batch not found');
    }

    const newAddress: Address = {
      ...address,
    };
    const newLand: Land = {
      ...land,
      address: newAddress,
      createdBy: executionCtx.userId, //Until we know how to get the LandID
    };

    return this.landRepository.create(newLand);
  }

  /**
   * @name findById
   * @param {string} landId Id from the land
   * @description Finds a land with his ID
   * @returns {Object} Returns the land found
   */
  async findById(landId): Promise<Land> {
    const landFound = await this.landRepository.findById(landId);
    if (isNil(landFound)) throw new NotFoundException('Land not found');
    if (landFound.deleted) throw new NotFoundException('Land not found');
    return landFound;
  }

  /**
   * @name findAll
   * @param {string} keyValue Value that we need to search
   * @param {number} skip Page of the paginate
   * @param  {number} limit Limit of the document result
   * @description Find all the land paginated
   * @returns {PaginateResult} Object with the land paginate
   */
  async findAll(keyValue = '', skip = 0, limit?: number): Promise<PaginateResult<Land>> {
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

    const lands = await this.landRepository.find({ query, options });
    const countLands = await this.landRepository.count(query);
    return {
      result: lands,
      total: countLands,
      page: skip !== 0 ? 1 : skip,
      pages: Math.ceil(countLands / limit) || 0,
    };
  }

  /**
   * @name update
   * @param {Object} land Object land to update
   * @description Update the land
   * @returns {Object} Returns the land updated
   */
  async update(exectionCtx: Context, land, landId: string): Promise<Land> {
    const landFound = await this.landRepository.findById(landId, {
      _id: 1,
      deleted: 1,
    });

    if (!isNil(land.batchId)) {
      const projection = { _id: 1, delete: 1 };
      const batch: Batch = await this.batchRepository.findById(land.batchId, projection);
      if (isNil(batch)) throw new NotFoundException('Batch not found');
      if (batch.deleted) throw new NotFoundException('Batch not found');
    }

    if (isNil(landFound)) throw new NotFoundException('Land not found');
    if (landFound.deleted) throw new NotFoundException('Land not found');
    land._id = landId;
    land.updatedBy = exectionCtx.userId;

    return this.landRepository.updateOne(land);
  }

  /**
   * @name delete
   * @param {string} landId Id from the land
   * @description Deletes the land but not remove from the DB
   * @returns {Object} Returns the result from the deletion
   */
  async delete(executionCtx: Context, landId: string): Promise<Land> {
    const land = await this.landRepository.findById(landId, {
      _id: 1,
      batchId: 1,
    });

    if (isNil(land)) throw new NotFoundException('Land not found');
    if (land.deleted) throw new BadRequestException('Land already deleted');

    if (!isNil(land.batchId)) await this.deleteLandInBatch(land.batchId, landId);
    land.deleted = true;
    land.deletedBy = executionCtx.userId;
    return this.landRepository.updateOne(land);
  }

  /**
   * @name deleteLandInBatch
   * @param {string} batchId Id from the batch
   * @param {string} landId Id from the land
   * @description Update the batch and delete the landId from the document
   * @returns Returns the Batch updated
   */
  async deleteLandInBatch(batchId: string, landId: string): Promise<Batch> {
    const projection = { _id: 1, delete: 1, landIds: 1 };
    const batch: Batch = await this.batchRepository.findById(batchId, projection);

    if (isNil(batch)) throw new NotFoundException('Batch not found');
    if (batch.deleted) throw new NotFoundException('Batch not found');
    if (isNil(batch.landIds)) throw new BadRequestException('Land does not exist in batch');
    if (!batch.landIds.includes(landId)) throw new BadRequestException('Land does not exist in batch');

    const newLandsArray = batch.landIds.filter((item) => item !== landId);

    return this.batchRepository.updateOne({
      _id: batchId,
      landIds: newLandsArray,
    });
  }
}
