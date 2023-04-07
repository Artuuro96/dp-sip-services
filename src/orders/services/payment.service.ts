import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Context } from 'src/auth/context/execution-ctx';
import { PaginateResult } from 'src/interfaces/paginate-result.interface';
import { CreditStatusEnum } from 'src/sales/repository/enums/credit.enum';
import { LandStatusEnum } from 'src/sales/repository/enums/land.enum';
import { CreditRepository } from 'src/sales/repository/repositories/credit.repository';
import { LandRepository } from 'src/sales/repository/repositories/land.repository';
import { Credit } from 'src/sales/repository/schemas/credit.schema';
import { PaymentDTO } from '../dtos/payment.dto';
import { CustomerRepository } from '../repository/repositories/customer.repository';
import { PaymentRepository } from '../repository/repositories/payment.repository';
import { Payment } from '../repository/schemas/payment.schema';

@Injectable()
export class PaymentService {
  constructor(
    private paymentRepository: PaymentRepository,
    private creditRepository: CreditRepository,
    private customerRepository: CustomerRepository,
    private landRepository: LandRepository,
  ) {}

  async create(executionCtx: Context, paymentDTO: PaymentDTO): Promise<Payment> {
    const credit = await this.creditRepository.findById(paymentDTO.creditId);
    const totalPayable = credit.nextPayment;

    if (!credit) {
      throw new NotFoundException(`Credit not found ${paymentDTO.creditId}`);
    }

    if (credit.status === CreditStatusEnum.FINISHED) {
      throw new ConflictException(`Credit ${paymentDTO.creditId} has been finished`);
    }

    if (paymentDTO.customerId === credit.customerId) {
      throw new ForbiddenException(
        `Customer ${paymentDTO.customerId} is not the owner of credit ${paymentDTO.creditId}`,
      );
    }

    const newPayment = new Payment();
    newPayment.landId = paymentDTO.landId;
    newPayment.customerId = paymentDTO.customerId;
    newPayment.createdBy = executionCtx.userId;
    newPayment.creditId = paymentDTO.creditId;
    newPayment.paymentDate = new Date();
    newPayment.sequence = credit.paymentIds.length + 1;

    if (!newPayment.isOnTime(credit.paymentDay)) {
      const customer = await this.customerRepository.findById(paymentDTO.customerId, {
        creditPoints: 1,
      });

      if (!customer) {
        throw new NotFoundException(`Customer ${paymentDTO.customerId} not found`);
      }

      await this.customerRepository.updateOne({
        updatedBy: executionCtx.userId,
        creditPoints: Number(customer.creditPoints) - 1,
      });
    }

    if (paymentDTO.quantity < totalPayable) {
      const remaining = credit.regularPayment - paymentDTO.quantity;
      credit.currentBalance = Number((credit.currentBalance - paymentDTO.quantity).toFixed(2));
      credit.nextPayment = credit.regularPayment + remaining;
      newPayment.quantity = paymentDTO.quantity;
      newPayment.advance = 0;
    }

    if (paymentDTO.quantity > totalPayable) {
      const advance = paymentDTO.quantity - credit.regularPayment;
      credit.currentBalance = Number((credit.currentBalance - credit.regularPayment).toFixed(2));
      credit.currentBalance = Number((credit.currentBalance - advance).toFixed(2));
      const remainingPayments = credit.termQuantity - credit.paymentIds.length - 1;
      credit.regularPayment = Number((credit.currentBalance / remainingPayments).toFixed(2));
      credit.nextPayment = credit.regularPayment;
      newPayment.quantity = totalPayable;
      newPayment.advance = advance;
    }

    if (paymentDTO.quantity === totalPayable) {
      credit.currentBalance = Number((credit.currentBalance - paymentDTO.quantity).toFixed(2));
      credit.nextPayment = credit.regularPayment;
      newPayment.quantity = paymentDTO.quantity;
      newPayment.advance = 0;
    }

    const payment = await this.paymentRepository.create(newPayment);

    credit.paymentIds.push(payment._id.toString());

    const hasBeenSettled = credit.currentBalance === 0;

    if (hasBeenSettled) {
      await this.landRepository.updateOne({
        _id: credit.landId,
        status: LandStatusEnum.PAIDOFF,
      });
      credit.status = CreditStatusEnum.FINISHED;
      credit.nextPayment = 0;
    }

    await this.creditRepository.updateOne(credit);

    return payment;
  }

  async findAll(keyValue, skip, limit): Promise<PaginateResult<Payment>> {
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

    const payments = await this.paymentRepository.find({ query, options });
    const countPayments = await this.paymentRepository.count(query);
    return {
      result: payments,
      total: countPayments,
      page: skip !== 0 ? 1 : skip,
      pages: Math.ceil(countPayments / limit) || 0,
    };
  }

  async findById(paymentId: string): Promise<Payment> {
    return await this.paymentRepository.findById(paymentId);
  }
}
