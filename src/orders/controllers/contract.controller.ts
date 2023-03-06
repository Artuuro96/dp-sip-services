import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ContractDTO } from '../dtos/contract.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ContractService } from '../services/contract.service';
import { Contract } from '../repository/schemas/contract.schema';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { Context } from 'src/auth/context/execution-ctx';
import { PaginateResult } from '../repository/interfaces/paginate-result.interface';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';

@UseGuards(AuthGuard)
@Controller({
  path: 'contracts',
})
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post()
  async create(@ExecutionCtx() executionCtx: Context, @Body() contract: ContractDTO): Promise<Contract> {
    return this.contractService.createForLand(executionCtx, contract);
  }

  @Get('/:contractId')
  async findById(@Param('contractId') contractId: string): Promise<Contract> {
    return this.contractService.findById(contractId);
  }

  @Get()
  async findAll(@Query() { skip, limit, keyValue }: PaginationParamsDTO): Promise<PaginateResult> {
    return this.contractService.findAll(keyValue, skip, limit);
  }
}
