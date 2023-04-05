import { Customer } from 'src/orders/repository/schemas/customer.schema';
import { Payment } from 'src/orders/repository/schemas/payment.schema';
import { Credit } from '../repository/schemas/credit.schema';

export class CustomerProfileDTO {
  customer: Customer;
  credit: Credit;
  payments: Payment[];

  constructor(customer: Customer, credit: Credit, payments: Payment[]) {
    Object.assign(this, {
      customer,
      credit,
      payments,
    });
  }
}
