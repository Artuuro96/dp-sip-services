import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreditDTO } from '../dtos/credit.dto';
import { CreditService } from '../services/credit.service';
import { Credit } from '../repository/schemas/credit.schema';
import { Context } from 'src/auth/context/execution-ctx';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { PaginateResult } from '../../interfaces/paginate-result.interface';

@UseGuards(AuthGuard)
@Controller('credit')
export class CreditController {
  constructor(private creditService: CreditService) {}

  @Post()
  async create(@ExecutionCtx() executionCtx: Context, @Body() credit: CreditDTO): Promise<Credit> {
    return this.creditService.createCredit(executionCtx, credit);
  }

  @Get('/:creditId')
  async findById(@Param('creditId') creditId: string): Promise<Credit> {
    return this.creditService.findById(creditId);
  }

  @Get()
  async findAll(@Query() { skip, limit, keyValue }: PaginationParamsDTO): Promise<PaginateResult<Credit>> {
    return this.creditService.findAll(keyValue, skip, limit);
  }
}
