import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { Context } from 'src/auth/context/execution-ctx';
import { PaginateResult } from 'src/interfaces/paginate-result.interface';
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

  async create(executionCtx: Context, paymentDTO: PaymentDTO): Promise<any> {
    const credit = await this.creditRepository.findById(paymentDTO.creditId);

    if (!credit) {
      throw new NotFoundException(`Credit not found ${paymentDTO.creditId}`);
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
    credit.currentBalance = credit.currentBalance - (payment.quantity + payment.advance);
    credit.totalPayments = credit.totalPayments - 1;

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
