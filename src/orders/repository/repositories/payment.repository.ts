import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { Payment, PaymentDocument } from '../schemas/payment.schema';

export class PaymentRepository {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  async create(payment: Payment): Promise<Payment> {
    return this.paymentModel.create(payment);
  }

  async find(findOptiopns): Promise<Payment[]> {
    const { query, projection, options } = findOptiopns;
    const paymentFind = this.paymentModel.find(query);
    if (!isNil(projection)) paymentFind.projection(projection);
    if (isNil(options)) return paymentFind;

    const { limit, skip } = options;
    if (!isNil(limit)) paymentFind.limit(limit);
    if (!isNil(skip)) paymentFind.skip(skip);

    return paymentFind;
  }

  async count(query): Promise<number> {
    return this.paymentModel.count(query);
  }

  async findById(paymentId, projection?): Promise<Payment> {
    return this.paymentModel.findById(paymentId, projection);
  }

  async updateOne(payment): Promise<Payment> {
    return this.paymentModel.findOneAndUpdate({ _id: payment._id }, payment, { new: true });
  }
}
