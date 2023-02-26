import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CustomerRepository } from '../../repository/repositories/customer.repository';
import { Customer, CustomerDocument } from '../../repository/schemas/customer.schema';

describe('CustomerService', () => {
  let mockCustomers: Partial<Customer[]>;
  let mockUpdatedCustomer: Partial<Customer>

  let customerRepository: CustomerRepository;
  let customerFactory = {
    count: jest.fn().mockResolvedValue(1),
    create: jest.fn().mockResolvedValue(Customer),
    findById: jest.fn().mockResolvedValue(Customer),
    findOneAndUpdate: jest.fn().mockResolvedValue(Customer),
    find: jest.fn().mockReturnThis(),
    projection: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis()
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRepository,
        { provide: getModelToken(Customer.name), 
          useValue: customerFactory
        },
      ],
    })
      .compile();
      mockCustomers = [{
          name:"Arturo",
          lastName:"Rodriguez",
          secondLastName:"Olvera",
          email:"arturo.rodriguez@gmail.com",
          "cellPhone": 5541588339,
          "phone": 5541588339,
          rfc:"ARO960",
          "address": {
              country: "Mexico",
              state: "Estado de Mexico",
              city: "Cuatitlan",
              town: "El mirador",
              street: "Lazaro cardenas",
              number: "8",
              "zip": 54095
          },
          facebook:"https://github.com/Artuuro96/dp-sip-server",
          birthday: new Date("03/20/1960"),
          avatar:"https://github.com/Artuuro96/dp-sip-server",
          createdBy: 'id-1'
        },{
          name:"Josue",
          lastName:"Ramirez",
          secondLastName:"Salvador",
          email:"josue.ramirez@gmail.com",
          cellPhone: 5541588339,
          phone: 5541588339,
          rfc:"RASJ96",
          address: {
              country: "Mexico",
              state: "Estado de Mexico",
              city: "Tlalnepantla",
              town: "Los reyes",
              street: "Av paseo del ferrocarril",
              number: "93",
              "zip": 54090
          },
          facebook:"https://github.com/Artuuro96/dp-sip-server",
          birthday: new Date("03/20/1960"),
          avatar:"https://github.com/Artuuro96/dp-sip-server",
          createdBy: 'id-1'
        }
      ];

      customerRepository = module.get<CustomerRepository>(CustomerRepository);
  });

  beforeEach(async () => {
    customerFactory.count = jest.fn().mockResolvedValue(1)
  });

  describe('create', () => {
    it('should return the new customer created', async () => {
      customerFactory.create = jest.fn().mockResolvedValue(mockCustomers[0]);
      const result = await customerRepository.create(mockCustomers[0]);
      expect(result).toBe((mockCustomers[0]));
    });
  });

  describe('find', () => {
    it('should return the new customer finded', async () => {
      customerFactory.find = jest.fn().mockResolvedValue(mockCustomers[0]);
      const result = await customerRepository.find({query:{ name:'Raul'}});
      expect(result).toBe((mockCustomers[0]));
    });
  });

  describe('count', () => {
    it('should count all the customers', async () => {
      customerFactory.count = jest.fn().mockResolvedValue(2)
      const result = await customerRepository.count({name:'Raul'});
      expect(result).toBe(2);
    });
  });

  describe('findById', () => {
    it('should return one customer', async () => {
      customerFactory.findById = jest.fn().mockResolvedValue(mockCustomers[0]);
      const result = await customerRepository.findById('id-1');
      expect(result).toBe(mockCustomers[0]);
    });
  });

  describe('updateOne', () => {
    it('should return the updated customer', async () => {
      customerFactory.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedCustomer);
      const result = await customerRepository.updateOne({ name:'Raul', _id:'id-1'});
      expect(result).toBe(mockUpdatedCustomer);
    });
  });

});
