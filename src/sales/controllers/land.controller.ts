import { Body, Controller, Get, Patch, Post, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Land } from '../repository/schemas/land.schema';
import { PaginateResult } from '../repository/interfaces/paginate-result.interface';
import { LandDTO } from '../dtos/land.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { LandService } from '../services/land.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ExecutionCtx } from 'src/auth/decorators/execution-ctx.decorator';
import { Context } from 'src/auth/context/execution-ctx';

@UseGuards(AuthGuard)
@Controller('lands')
export class LandController {
  constructor(private landService: LandService) {}

  /**
   * Creates a new Land
   */

  @Post()
  async create(@ExecutionCtx() executionCtx: Context, @Body() land: LandDTO): Promise<Land> {
    return this.landService.create(executionCtx, land);
  }

  @Get('/:landId')
  async findById(@Param('landId') landId: string): Promise<Land> {
    return this.landService.findById(landId);
  }

  @Get()
  async findAll(@Query() { skip, limit, keyValue }: PaginationParamsDTO): Promise<PaginateResult> {
    return this.landService.findAll(keyValue, skip, limit);
  }

  @Patch('/:landId')
  async update(
    @ExecutionCtx() executionCtx: Context,
    @Body() land: Partial<Land>,
    @Param('landId') landId: string,
  ): Promise<Land> {
    return this.landService.update(executionCtx, land, landId);
  }

  @Delete('/:landId')
  async delete(@ExecutionCtx() executionCtx: Context, @Param('landId') landId: string): Promise<Land> {
    return this.landService.delete(executionCtx, landId);
  }
}
