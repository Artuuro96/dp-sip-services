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
import { Batch } from '../repository/schemas/batch.schema';
import { PaginateResult } from '../repository/interfaces/paginate-result.interface';
import { BatchDTO } from '../dtos/batch.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { BatchService } from '../services/batch.service';

@Controller({
  path: 'batches',
})
export class BatchController {
  constructor(private batchService: BatchService) {}

  /**
   * Creates a new Batch
   */

  @Post()
  async create(@Body() batch: BatchDTO): Promise<Batch> {
    return this.batchService.create(batch);
  }

  @Get('/:batchId')
  async findById(@Param('batchId') batchId: string): Promise<Batch> {
    return this.batchService.findById(batchId);
  }

  @Get()
  async findAll(
    @Query() { skip, limit, keyValue }: PaginationParamsDTO,
  ): Promise<PaginateResult> {
    return this.batchService.findAll(keyValue, skip, limit);
  }

  @Patch('/:batchId')
  async update(
    @Body() batch: Partial<Batch>,
    @Param('batchId') batchId: string,
  ): Promise<Batch> {
    return this.batchService.update(batch, batchId);
  }

  @Delete('/:batchId')
  async delete(@Param('batchId') batchId: string): Promise<Batch> {
    return this.batchService.delete(batchId);
  }
}
