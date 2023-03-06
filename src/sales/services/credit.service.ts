import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContractRepository } from '../../orders/repository/repositories/contract.repository';
import { CreditDTO } from '../dtos/credit.dto';
import { CreditRepository } from '../repository/repositories/credit.repository';
import { isNil } from 'lodash';
import { Credit } from '../repository/schemas/credit.schema';
import { TermTypeEnum } from '../repository/enums/term.enum copy';
import { Context } from 'src/auth/context/execution-ctx';
import { PaginateResult } from '../repository/interfaces/paginate-result.interface';

@Injectable()
export class CreditService {
  constructor(private creditRepository: CreditRepository, private contractRepository: ContractRepository) {}

  async createCredit(executionCtx: Context, credit: CreditDTO): Promise<Credit> {
    const contract = await this.contractRepository.findById(credit.contractId);

    if (isNil(contract)) throw new NotFoundException('Contract not found');
    if (contract.deleted) throw new NotFoundException('Contract not found');

    if (credit.termType === TermTypeEnum.MONThLY) {
      if (credit.paymentDay < 1 || credit.paymentDay > 31)
        throw new BadRequestException('Payment day should be a valid day in a month');
    } else {
      if (credit.paymentDay < 0 || credit.paymentDay > 7)
        throw new BadRequestException('Payment day should be a valid day in a week');
    }

    const newCredit: Credit = {
      ...credit,
      startDate: new Date(credit.startDate),
      endDate: new Date(credit.endDate),
      paymentIds: [],
      createdBy: executionCtx.userId,
    };

    const creditCreated = await this.creditRepository.create(newCredit);

    if (isNil(creditCreated)) throw new BadRequestException('Error creating contract');

    contract.creditId = creditCreated._id.toString();
    await this.contractRepository.updateOne(contract);

    return creditCreated;
  }

  async findById(contractId): Promise<Credit> {
    const creditFounded = await this.creditRepository.findById(contractId);
    if (isNil(creditFounded)) throw new NotFoundException('Customer not found');
    if (creditFounded.deleted) throw new NotFoundException('Customer not found');
    return creditFounded;
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

    const credits = await this.creditRepository.find({ query, options });
    const countCredits = await this.creditRepository.count(query);
    return {
      result: credits,
      total: countCredits,
      page: skip !== 0 ? 1 : skip,
      pages: Math.ceil(countCredits / limit) || 0,
    };
  }
}
