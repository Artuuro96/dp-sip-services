import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isNil } from 'lodash';
import { Contract, ContractDocument } from '../schemas/contract.schema';

export class ContractRepository {
  constructor(
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
  ) {}

  async create(contract: Contract): Promise<Contract> {
    return this.contractModel.create(contract)
  }

  async find(findOptiopns): Promise<Contract[]> {
    const {query, projection, options} = findOptiopns;
    const contractFind = this.contractModel.find(query)
    if(!isNil(projection))
      contractFind.projection(projection)
    if(isNil(options))
      return  contractFind
    
    const {limit, skip} = options
    if(!isNil(limit))
      contractFind.limit(limit)
    if(!isNil(skip))
      contractFind.skip(skip)

    return  contractFind
  }
f
  async count(query): Promise<number> {
    return this.contractModel.count(query);
  }

  async findById(contractId, projection?): Promise<Contract> {
    return this.contractModel.findById(contractId, projection);
  }

  async updateOne(contract): Promise<Contract> {
    return this.contractModel.findOneAndUpdate(
      { _id: contract._id },
      contract,
      {new: true}
    );
  }
}
