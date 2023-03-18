import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { PaymentService } from '../services/payment.service';
import { Context } from 'src/auth/context/execution-ctx';
import { PaymentDTO } from '../dtos/payment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { PaginateResult } from '../../interfaces/paginate-result.interface';
import { Payment } from '../repository/schemas/payment.schema';

@Controller('payment')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async create(@ExecutionCtx() executionCtx: Context, @Body() paymentDTO: PaymentDTO): Promise<any> {
    return await this.paymentService.create(executionCtx, paymentDTO);
  }

  @Get()
  async findAll(@Query() { skip, limit, keyValue }: PaginationParamsDTO): Promise<PaginateResult<Payment>> {
    return this.paymentService.findAll(keyValue, skip, limit);
  }
}
