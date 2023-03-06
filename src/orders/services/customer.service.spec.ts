import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomerRepository } from '../repository/repositories/customer.repository';
import { Customer } from '../repository/schemas/customer.schema';
import { CustomerDTO } from '../dtos/customer.dto';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let customerService: CustomerService;
  let mockCustomers: Partial<Customer[]>;
  let mockUpdatedCustomer: Partial<Customer>;
  let mockDeletedCustomer: Partial<Customer>;
  let mockCustomerDTO: CustomerDTO;
  let mockCustomerDeleted: Partial<Customer>;

  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        CustomerRepository,
        { provide: getModelToken(Customer.name), useClass: Customer },
      ],
    }).compile();

    mockCustomerDTO = {
      name: 'Arturo',
      lastName: 'Rodriguez',
      secondLastName: 'Olvera',
      email: 'arturo.rodriguez@gmail.com',
      cellPhone: 5541588339,
      phone: 5541588339,
      rfc: 'ARO960',
      address: {
        country: 'Mexico',
        state: 'Estado de Mexico',
        city: 'Cuatitlan',
        town: 'El mirador',
        street: 'Lazaro cardenas',
        number: '8',
        zip: 54095,
      },
      facebook: 'https://github.com/Artuuro96/dp-sip-server',
      birthday: '03/20/1960',
      avatar: 'https://github.com/Artuuro96/dp-sip-server',
    };

    mockCustomers = [
      {
        name: 'Arturo',
        lastName: 'Rodriguez',
        secondLastName: 'Olvera',
        email: 'arturo.rodriguez@gmail.com',
        cellPhone: 5541588339,
        phone: 5541588339,
        rfc: 'ARO960',
        address: {
          country: 'Mexico',
          state: 'Estado de Mexico',
          city: 'Cuatitlan',
          town: 'El mirador',
          street: 'Lazaro cardenas',
          number: '8',
          zip: 54095,
        },
        facebook: 'https://github.com/Artuuro96/dp-sip-server',
        birthday: new Date('03/20/1960'),
        avatar: 'https://github.com/Artuuro96/dp-sip-server',
        createdBy: 'id-1',
      },
      {
        name: 'Josue',
        lastName: 'Ramirez',
        secondLastName: 'Salvador',
        email: 'josue.ramirez@gmail.com',
        cellPhone: 5541588339,
        phone: 5541588339,
        rfc: 'RASJ96',
        address: {
          country: 'Mexico',
          state: 'Estado de Mexico',
          city: 'Tlalnepantla',
          town: 'Los reyes',
          street: 'Av paseo del ferrocarril',
          number: '93',
          zip: 54090,
        },
        facebook: 'https://github.com/Artuuro96/dp-sip-server',
        birthday: new Date('03/20/1960'),
        avatar: 'https://github.com/Artuuro96/dp-sip-server',
        createdBy: 'id-1',
      },
    ];

    mockUpdatedCustomer = {
      name: 'Raul',
      lastName: 'Ramirez',
      secondLastName: 'Salvador',
      email: 'josue.ramirez@gmail.com',
      cellPhone: 5541588339,
      phone: 5541588339,
      rfc: 'RASJ96',
      address: {
        country: 'Mexico',
        state: 'Estado de Mexico',
        city: 'Tlalnepantla',
        town: 'Los reyes',
        street: 'Av paseo del ferrocarril',
        number: '93',
        zip: 54090,
      },
      facebook: 'https://github.com/Artuuro96/dp-sip-server',
      birthday: new Date('03/20/1960'),
      avatar: 'https://github.com/Artuuro96/dp-sip-server',
      createdBy: 'id-1',
    };

    mockDeletedCustomer = {
      deleted: true,
      name: 'Raul',
      lastName: 'Ramirez',
      secondLastName: 'Salvador',
      email: 'josue.ramirez@gmail.com',
      cellPhone: 5541588339,
      phone: 5541588339,
      rfc: 'RASJ96',
      address: {
        country: 'Mexico',
        state: 'Estado de Mexico',
        city: 'Tlalnepantla',
        town: 'Los reyes',
        street: 'Av paseo del ferrocarril',
        number: '93',
        zip: 54090,
      },
      facebook: 'https://github.com/Artuuro96/dp-sip-server',
      birthday: new Date('03/20/1960'),
      avatar: 'https://github.com/Artuuro96/dp-sip-server',
      createdBy: 'id-1',
    };

    mockCustomerDeleted = {
      deleted: true,
    };

    customerService = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
  });

  describe('create', () => {
    it('should return the new customer created', async () => {
      customerRepository.create = jest.fn().mockResolvedValue(mockCustomers[0]);
      customerRepository.find = jest.fn().mockResolvedValue([]);
      const result = await customerService.create(mockCustomerDTO);
      expect(result).toBe(mockCustomers[0]);
    });

    it('should fail creating a New customer', async () => {
      customerRepository.find = jest.fn().mockResolvedValue(mockCustomers);
      await expect(customerService.create(mockCustomerDTO)).rejects.toThrow('Email already registered');
    });
  });

  describe('findbyId Customer', () => {
    it('should get a Customer', async () => {
      customerRepository.findById = jest.fn().mockResolvedValue(mockCustomers[0]);
      const result = await customerService.findById('id-1');
      expect(result).toBe(mockCustomers[0]);
    });
    it('should fail in get a Customer', async () => {
      customerRepository.findById = jest.fn().mockResolvedValue(null);
      await expect(customerService.findById('id-1')).rejects.toThrow('User not found');
    });
    it('should fail in get a Customer that was deleted', async () => {
      customerRepository.findById = jest.fn().mockResolvedValue(mockCustomerDeleted);
      await expect(customerService.findById('id-1')).rejects.toThrow('User not found');
    });
  });

  describe('findAll Customer', () => {
    it('should get 2 Customers', async () => {
      customerRepository.find = jest.fn().mockResolvedValue(mockCustomers);
      customerRepository.count = jest.fn().mockResolvedValue(2);
      const result = await customerService.findAll('', 1, 10);
      expect(result.result).toBe(mockCustomers);
    });
  });

  describe('update Customer', () => {
    it('should update a Customer', async () => {
      customerRepository.updateOne = jest.fn().mockResolvedValue(mockUpdatedCustomer);
      customerRepository.findById = jest.fn().mockResolvedValue(mockCustomers[0]);
      const result = await customerService.update({ name: 'Raul' }, 'id-1');
      expect(result).toBe(mockUpdatedCustomer);
    });

    it('should fail update a Customer', async () => {
      customerRepository.updateOne = jest.fn().mockResolvedValue(mockUpdatedCustomer);
      customerRepository.findById = jest.fn().mockResolvedValue(null);
      await expect(customerService.update({ name: 'Raul' }, 'id-1')).rejects.toThrow('User not found');
    });

    it('should fail update a Customer that was deleted', async () => {
      customerRepository.updateOne = jest.fn().mockResolvedValue(mockUpdatedCustomer);
      customerRepository.findById = jest.fn().mockResolvedValue(mockCustomerDeleted);
      await expect(customerService.update({ name: 'Raul' }, 'id-1')).rejects.toThrow('User not found');
    });
  });

  describe('delete Customer', () => {
    it('should delete Customer', async () => {
      customerRepository.updateOne = jest.fn().mockResolvedValue(mockDeletedCustomer);
      customerRepository.findById = jest.fn().mockResolvedValue(mockCustomers[0]);
      const result = await customerService.delete('id-1');
      expect(result).toBe(mockDeletedCustomer);
    });

    it('should fail delete a Customer', async () => {
      customerRepository.updateOne = jest.fn().mockResolvedValue(mockUpdatedCustomer);
      customerRepository.findById = jest.fn().mockResolvedValue(null);
      await expect(customerService.delete('id-1')).rejects.toThrow('User not found');
    });

    it('should fail delete a Customer that was deleted', async () => {
      customerRepository.updateOne = jest.fn().mockResolvedValue(mockUpdatedCustomer);
      customerRepository.findById = jest.fn().mockResolvedValue(mockCustomerDeleted);
      await expect(customerService.delete('id-1')).rejects.toThrow('User already deleted');
    });
  });
});
