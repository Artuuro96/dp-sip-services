import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { Customer, CustomerDocument } from '../schemas/customer.schema';

export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(customer: Customer): Promise<Customer> {
    return this.customerModel.create(customer)
  }

  async find(findOptiopns): Promise<Customer[]> {
    const {query, projection, options} = findOptiopns;
    const customerFind = this.customerModel.find(query)
    if(!isNil(projection))
      customerFind.projection(projection)
    if(isNil(options))
      return  customerFind
    
    const {limit, skip} = options
    if(!isNil(limit))
      customerFind.limit(limit)
    if(!isNil(skip))
      customerFind.skip(skip)

    return  customerFind
  }
f
  async count(query): Promise<number> {
    return this.customerModel.count(query);
  }

  async findById(customerId, projection?): Promise<Customer> {
    return this.customerModel.findById(customerId, projection);
  }

  async updateOne(customer): Promise<Customer> {
    return this.customerModel.findOneAndUpdate(
      { _id: customer._id },
      customer,
      {new: true}
    );
  }
}
