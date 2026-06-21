import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { HechongService } from './hechong.service';

@Controller('hechong')
export class HechongController {
  constructor(private readonly hechongService: HechongService) {}

  @Get(':chartId')
  async getRelations(@Param('chartId', ParseIntPipe) chartId: number) {
    const result = await this.hechongService.getRelations(chartId);
    if (!result) {
      throw new HttpException(
        { type: 'https://bazi.app/errors/chart-not-found', title: '命盘不存在', status: HttpStatus.NOT_FOUND, detail: `chartId=${chartId} 对应的命盘记录不存在` },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}