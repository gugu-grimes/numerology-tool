import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { GejuService } from './geju.service';

@Controller('analysis/geju')
export class GejuController {
  constructor(private readonly gejuService: GejuService) {}

  @Get(':chartId')
  async getGeju(@Param('chartId', ParseIntPipe) chartId: number) {
    const result = await this.gejuService.getGeju(chartId);
    if (!result) {
      throw new HttpException(
        { type: 'https://bazi.app/errors/chart-not-found', title: '命盘不存在', status: HttpStatus.NOT_FOUND, detail: `chartId=${chartId} 对应的命盘记录不存在` },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}