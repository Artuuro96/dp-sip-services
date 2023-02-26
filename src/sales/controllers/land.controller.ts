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
import { Land } from '../repository/schemas/land.schema';
import { PaginateResult } from '../repository/interfaces/paginate-result.interface';
import { LandDTO } from '../dtos/land.dto';
import { PaginationParamsDTO } from '../dtos/paginationParams.dto';
import { LandService } from '../services/land.service';

@Controller({
  path: 'lands',
})
export class LandController {
  constructor(private landService: LandService) {}

  /**
   * Creates a new Land
   */

  @Post()
  async create(@Body() land: LandDTO): Promise<Land> {
    return this.landService.create(land);
  }

  @Get('/:landId')
  async findById(@Param('landId') landId: string): Promise<Land> {
    return this.landService.findById(landId);
  }

  @Get()
  async findAll(
    @Query() { skip, limit, keyValue }: PaginationParamsDTO,
  ): Promise<PaginateResult> {
    return this.landService.findAll(keyValue, skip, limit);
  }

  @Patch('/:landId')
  async update(
    @Body() land: Partial<Land>,
    @Param('landId') landId: string,
  ): Promise<Land> {
    return this.landService.update(land, landId);
  }

  @Delete('/:landId')
  async delete(@Param('landId') landId: string): Promise<Land> {
    return this.landService.delete(landId);
  }
}
