import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PaginateResult } from '../repository/interfaces/paginate-result.interface';
import { Customer } from '../repository/schemas/customer.schema';
import { CustomerDTO } from '../dtos/customer.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { CustomerService } from '../services/customer.service';

@Controller({
  path: 'customers',
})
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  /**
   * Creates a new customer
   */

  @Post()
  async create(@Body() customer: CustomerDTO): Promise<Customer> {
    return this.customerService.create(customer);
  }

  @Get('/:customerId')
  async findById(@Param('customerId') customerId: string): Promise<Customer> {
    return this.customerService.findById(customerId);
  }

  @Get()
  async findAll(
    @Query() { skip, limit, keyValue }: PaginationParamsDTO,
  ): Promise<PaginateResult> {
    return this.customerService.findAll(keyValue, skip, limit);
  }

  @Patch('/:customerId')
  async update(
    @Body() customer: Partial<Customer>,
    @Param('customerId') customerId: string,
  ): Promise<Customer> {
    return this.customerService.update(customer, customerId);
  }

  @Delete('/:customerId')
  async delete(@Param('customerId') customerId: string): Promise<Customer> {
    return this.customerService.delete(customerId);
  }
}
