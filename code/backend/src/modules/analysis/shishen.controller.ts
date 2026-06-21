import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ShishenService } from './shishen.service';

@Controller('analysis/shishen')
export class ShishenController {
  constructor(private readonly shishenService: ShishenService) {}

  @Get(':chartId')
  async getShishen(@Param('chartId', ParseIntPipe) chartId: number) {
    const result = await this.shishenService.getShishen(chartId);
    if (!result) {
      throw new HttpException(
        { type: 'https://bazi.app/errors/chart-not-found', title: '命盘不存在', status: HttpStatus.NOT_FOUND, detail: `chartId=${chartId} 对应的命盘记录不存在` },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}