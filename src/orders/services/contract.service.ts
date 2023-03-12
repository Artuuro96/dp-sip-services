import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContractDTO } from '../dtos/contract.dto';
import { Contract } from '../repository/schemas/contract.schema';
import { ContractRepository } from '../repository/repositories/contract.repository';
import { LandRepository } from '../../sales/repository/repositories/land.repository';
import { BatchRepository } from '../../sales/repository/repositories/batch.repository';
import { Batch } from 'src/sales/repository/schemas/batch.schema';
import { isNil } from 'lodash';
import { PaymentTypeEnum } from '../repository/enums/payment.enum';
import { ContractStatusEnum } from '../repository/enums/contract.enum';
import { LandService } from '../../sales/services/land.service';
import { Context } from 'src/auth/context/execution-ctx';
import { v4 as uuidv4 } from 'uuid';
import { PaginateResult } from '../repository/interfaces/paginate-result.interface';

@Injectable()
export class ContractService {
  constructor(
    private batchRepository: BatchRepository,
    private contractRepository: ContractRepository,
    private landRepository: LandRepository,
    private landService: LandService,
  ) {}

  async createForLand(executionCtx: Context, contract: ContractDTO): Promise<Contract> {
    let batch: Batch;
    const land = await this.landRepository.findById(contract.landId, {
      _id: 1,
      batchId: 1,
      available: 1,
      deleted: 1,
    });

    if (isNil(land)) throw new NotFoundException('Land not found');
    if (land.deleted) throw new NotFoundException('Land not found');
    if (!land.available) throw new BadRequestException('Land not available');

    if (!isNil(land.batchId)) {
      const projection = { _id: 1, deleted: 1 };
      batch = await this.batchRepository.findById(land.batchId, projection);
      if (isNil(batch)) throw new NotFoundException('Batch not found');
      if (batch.deleted) throw new NotFoundException('Batch not found');
    }

    let status = ContractStatusEnum.AFFECTED;
    if (contract.paymentType === PaymentTypeEnum.FULLPAYMENT) {
      status = ContractStatusEnum.AVAILABLE;
    }

    const newContract = {
      ...contract,
      contractNumber: uuidv4(),
      sellerId: !isNil(contract.sellerId) ? contract.sellerId : executionCtx.userId,
      status: status,
      createdBy: executionCtx.userId,
    };
    const contractCreated = await this.contractRepository.create(newContract);

    if (isNil(contractCreated)) throw new BadRequestException('Error creating contract');
    const landUpdate = {
      _id: land._id,
      available: false,
    };

    await this.landRepository.updateOne(landUpdate);
    if (!isNil(land.batchId)) {
      await this.landService.deleteLandInBatch(land.batchId, land._id.toString());
    }
    return contractCreated;
  }

  async findById(contractId): Promise<Contract> {
    const contractFound = await this.contractRepository.findById(contractId);
    if (isNil(contractFound)) throw new NotFoundException('Customer not found');
    if (contractFound.deleted) throw new NotFoundException('Customer not found');
    return contractFound;
  }

  async findAll(keyValue = '', skip = 0, limit?: number): Promise<PaginateResult> {
    skip = Number(skip);
    limit = Number(limit);
    const options = {
      skip: skip > 0 ? skip - 1 : skip,
      limit,
    };
    const query = {
      name: new RegExp(`${keyValue}`, 'i'),
    };

    const contracts = await this.contractRepository.find({ query, options });
    const countContracts = await this.contractRepository.count(query);
    return {
      result: contracts,
      total: countContracts,
      page: skip !== 0 ? 1 : skip,
      pages: Math.ceil(countContracts / limit) || 0,
    };
  }
}
