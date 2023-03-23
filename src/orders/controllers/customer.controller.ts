import { Body, Controller, Get, Patch, Post, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PaginateResult } from '../../interfaces/paginate-result.interface';
import { Customer } from '../repository/schemas/customer.schema';
import { CustomerDTO } from '../dtos/customer.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { CustomerService } from '../services/customer.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { Context } from 'src/auth/context/execution-ctx';

@UseGuards(AuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  /**
   * Creates a new customer
   */

  @Post()
  async create(@ExecutionCtx() executionCtx: Context, @Body() customer: CustomerDTO): Promise<Customer> {
    return this.customerService.create(executionCtx, customer);
  }

  @Get('/profile/:customerId')
  async findProfile(@Param('customerId') customerId: string): Promise<any> {
    return this.customerService.findProfile(customerId);
  }

  @Get('/:customerId')
  async findById(@Param('customerId') customerId: string): Promise<Customer> {
    return this.customerService.findById(customerId);
  }

  @Get()
  async findAll(@Query() { skip, limit, keyValue }: PaginationParamsDTO): Promise<PaginateResult<Customer>> {
    return this.customerService.findAll(keyValue, skip, limit);
  }

  @Patch('/:customerId')
  async update(
    @ExecutionCtx() executionCtx: Context,
    @Body() customer: Partial<Customer>,
    @Param('customerId') customerId: string,
  ): Promise<Customer> {
    return this.customerService.update(executionCtx, customer, customerId);
  }

  @Delete('/:customerId')
  async delete(
    @ExecutionCtx() executionCtx: Context,
    @Param('customerId') customerId: string,
  ): Promise<Customer> {
    return this.customerService.delete(executionCtx, customerId);
  }
}
