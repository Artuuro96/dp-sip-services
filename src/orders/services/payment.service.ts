import { ConflictException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Context } from 'src/auth/context/execution-ctx';
import { PaginateResult } from 'src/interfaces/paginate-result.interface';
import { CreditStatusEnum } from 'src/sales/repository/enums/credit.enum';
import { CreditRepository } from 'src/sales/repository/repositories/credit.repository';
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
    private logger: Logger,
  ) {}

  async create(executionCtx: Context, paymentDTO: PaymentDTO): Promise<Payment> {
    const credit = await this.creditRepository.findById(paymentDTO.creditId);

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
    newPayment.advance = paymentDTO.advance || 0;
    newPayment.quantity = paymentDTO.quantity;

    if (!newPayment.isOnTime(credit.paymentDay)) {
      this.logger.log(`Payment after due date, reducing credit points for ${paymentDTO.customerId}`);
      const creditPoints = await this.customerRepository.findById(paymentDTO.customerId, { creditPoints: 1 });
      await this.customerRepository.updateOne({
        updatedBy: executionCtx.userId,
        creditPoints: Number(creditPoints) - 1,
      });
    }

    const payment = await this.paymentRepository.create(newPayment);

    credit.paymentIds.push(payment._id.toString());
    credit.currentBalance = Number((credit.currentBalance - (payment.quantity + payment.advance)).toFixed(4));
    credit.totalPayments = credit.totalPayments - 1;

    const hasBeenSettled = credit.currentBalance <= 0.001;

    if (hasBeenSettled) {
      credit.status = CreditStatusEnum.FINISHED;
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
