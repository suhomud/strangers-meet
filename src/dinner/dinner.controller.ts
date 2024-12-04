import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DinnerService } from './dinner.service';
import { Dinner } from './entities/dinner.entity';

@Controller('dinners')
export class DinnerController {
  constructor(private readonly dinnerService: DinnerService) {}

  @Get()
  findAll() {
    return this.dinnerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.dinnerService.findOne(id);
  }

  @Post()
  create(@Body() dinner: Partial<Dinner>) {
    return this.dinnerService.create(dinner);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dinner: Partial<Dinner>) {
    return this.dinnerService.update(id, dinner);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.dinnerService.delete(id);
  }
}