import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContractDTO } from '../dtos/contract.dto';
import { Contract } from '../repository/schemas/contract.schema';
import { Customer } from '../repository/schemas/customer.schema';
import { ContractRepository } from '../repository/repositories/contract.repository';
import { CustomerRepository } from '../repository/repositories/customer.repository';
import { LandRepository } from '../../sales/repository/repositories/land.repository';
import { BatchRepository } from '../../sales/repository/repositories/batch.repository';
import { Batch } from 'src/sales/repository/schemas/batch.schema';
import { isNil } from 'lodash';
import { PaymentTypeEnum } from '../repository/enums/payment.enum';
import { ContractStatusEnum } from '../repository/enums/contract.enum';
import { LandService } from '../../sales/services/land.service';
import { Context } from 'src/auth/context/execution-ctx';
import { v4 as uuidv4 } from 'uuid';
import { PaginateResult } from '../../interfaces/paginate-result.interface';
import { CreditRepository } from '../../sales/repository/repositories/credit.repository';
import { Credit } from '../../sales/repository/schemas/credit.schema';
import { LandStatusEnum } from 'src/sales/repository/enums/land.enum';

@Injectable()
export class ContractService {
  constructor(
    private batchRepository: BatchRepository,
    private contractRepository: ContractRepository,
    private landRepository: LandRepository,
    private landService: LandService,
    private creditRepository: CreditRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async createForLand(executionCtx: Context, contract: ContractDTO): Promise<Contract> {
    let batch: Batch;
    const land = await this.landRepository.findById(contract.landId, {
      _id: 1,
      batchId: 1,
      name: 1,
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

    let status = ContractStatusEnum.CREATED;
    if (contract.paymentType === PaymentTypeEnum.FULLPAYMENT) {
      status = ContractStatusEnum.IN_PROGRESS;
    }

    const newContract = {
      ...contract,
      sellerId: !isNil(contract.sellerId) ? contract.sellerId : executionCtx.userId,
      status: status,
      createdBy: executionCtx.userId,
      landName: land.name,
    };
    const contractCreated = await this.contractRepository.create(newContract);

    if (isNil(contractCreated)) throw new BadRequestException('Error creating contract');
    const landUpdate = {
      _id: land._id,
      available: false,
      status: LandStatusEnum.SELLED,
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

  async findAll(keyValue = '', skip = 0, limit = 10): Promise<PaginateResult<Contract>> {
    skip = Number(skip);
    limit = Number(limit);
    const page = skip > 0 ? skip - 1 : skip;
    const options = {
      skip: skip > 0 ? skip - 1 : skip,
      limit,
    };
    options.skip = options.skip * limit;
    const query = {
      nameLand: new RegExp(`${keyValue}`, 'i'),
      deleted: false,
    };

    const creditsId: string[] = [];
    const customersId: string[] = [];
    const contracts = await this.contractRepository.find({ query, options });
    contracts.forEach((contract: Contract) => {
      if (!isNil(contract.creditId)) {
        creditsId.push(contract.creditId.toString());
      }
      if (!isNil(contract.customerId)) {
        customersId.push(contract.customerId.toString());
      }
    });

    let credits: Credit[] = [];
    if (creditsId.length > 0) {
      credits = await this.creditRepository.find({
        query: {
          _id: {
            $in: creditsId,
          },
        },
      });
    }

    let customers: Customer[] = [];
    if (customersId.length > 0) {
      customers = await this.customerRepository.find({
        query: {
          _id: {
            $in: customersId,
          },
        },
        projection: {
          name: 1,
        },
      });
    }

    const resultsToReturn = [];

    contracts.forEach((contract) => {
      const credit = credits.find((credit) => credit._id.toString() === contract.creditId?.toString());
      const customer = customers.find(
        (customer) => customer._id.toString() === contract.customerId?.toString(),
      );

      const resultObj = {
        contract,
        credit: credit ? credit : {},
        customer: customer ? customer : {},
      };

      resultsToReturn.push(resultObj);
    });

    const countContracts = await this.contractRepository.count(query);
    return {
      result: resultsToReturn,
      total: countContracts,
      page: page === 0 ? 1 : page,
      pages: Math.ceil(countContracts / limit) || 0,
    };
  }

  async countSales(): Promise<any> {
    const count = await this.contractRepository.count({});
  }
}
