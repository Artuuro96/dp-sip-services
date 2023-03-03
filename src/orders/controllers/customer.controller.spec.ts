import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../repository/schemas/customer.schema';
import { CustomerRepository } from '../repository/repositories/customer.repository';
import { getModelToken } from '@nestjs/mongoose';

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: CustomerService;
  let mockCustomers: Partial<Customer[]>;
  let mockUpdatedCustomer: Partial<Customer>;
  let mockDeletedCustomer: Partial<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        CustomerService,
        CustomerRepository,
        { provide: getModelToken(Customer.name), useClass: Customer },
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    customerService = module.get<CustomerService>(CustomerService);

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
  });

  describe('POST Customer', () => {
    it('should create user', async () => {
      customerService.create = jest.fn().mockResolvedValue(mockCustomers[0]);
      const result = await customerController.create({
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
        birthday: '03/20/1960',
        avatar: 'https://github.com/Artuuro96/dp-sip-server',
      });
      expect(customerService.create).toHaveBeenCalledWith({
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
        birthday: '03/20/1960',
        avatar: 'https://github.com/Artuuro96/dp-sip-server',
      });
      expect(result).toBe(mockCustomers[0]);
    });
  });

  describe('GET findbyId Customer', () => {
    it('should create Customer', async () => {
      customerService.findById = jest.fn().mockResolvedValue(mockCustomers[0]);
      const result = await customerController.findById('id-1');
      expect(customerService.findById).toHaveBeenCalledWith('id-1');
      expect(result).toBe(mockCustomers[0]);
    });
  });

  describe('GET findAll Customer', () => {
    it('should create Customer', async () => {
      customerService.findAll = jest.fn().mockResolvedValue(mockCustomers);
      const result = await customerController.findAll({
        keyValue: '',
        skip: 1,
        limit: 10,
      });
      expect(customerService.findAll).toHaveBeenCalledWith('', 1, 10);
      expect(result).toBe(mockCustomers);
    });
  });

  describe('PATCH update Customer', () => {
    it('should create Customer', async () => {
      customerService.update = jest.fn().mockResolvedValue(mockUpdatedCustomer);
      const result = await customerController.update({ name: 'Raul' }, 'id-1');
      expect(customerService.update).toHaveBeenCalledWith(
        { name: 'Raul' },
        'id-1',
      );
      expect(result).toBe(mockUpdatedCustomer);
    });
  });

  describe('DELETE delete Customer', () => {
    it('should create Customer', async () => {
      customerService.delete = jest.fn().mockResolvedValue(mockDeletedCustomer);
      const result = await customerController.delete('id-1');
      expect(customerService.delete).toHaveBeenCalledWith('id-1');
      expect(result).toBe(mockDeletedCustomer);
    });
  });
});
