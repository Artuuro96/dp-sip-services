import { Body, Controller, Get, Patch, Post, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Batch } from '../repository/schemas/batch.schema';
import { PaginateResult } from '../repository/interfaces/paginate-result.interface';
import { BatchDTO } from '../dtos/batch.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { BatchService } from '../services/batch.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { Context } from 'src/auth/context/execution-ctx';

@UseGuards(AuthGuard)
@Controller('batches')
export class BatchController {
  constructor(private batchService: BatchService) {}

  /**
   * Creates a new Batch
   */

  @Post()
  async create(@ExecutionCtx() executionCtx: Context, @Body() batch: BatchDTO): Promise<Batch> {
    return this.batchService.create(executionCtx, batch);
  }

  @Get('/:batchId')
  async findById(@Param('batchId') batchId: string): Promise<Batch> {
    return this.batchService.findById(batchId);
  }

  @Get()
  async findAll(@Query() { skip, limit, keyValue }: PaginationParamsDTO): Promise<PaginateResult> {
    return this.batchService.findAll(keyValue, skip, limit);
  }

  @Patch('/:batchId')
  async update(
    @ExecutionCtx() executionCtx: Context,
    @Body() batch: Partial<Batch>,
    @Param('batchId') batchId: string,
  ): Promise<Batch> {
    return this.batchService.update(executionCtx, batch, batchId);
  }

  @Delete('/:batchId')
  async delete(@ExecutionCtx() executionCtx: Context, @Param('batchId') batchId: string): Promise<Batch> {
    return this.batchService.delete(executionCtx, batchId);
  }
}
