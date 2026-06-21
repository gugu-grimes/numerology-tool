import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { YongshenService } from './yongshen.service';

@Controller('yongshen')
export class YongshenController {
  constructor(private readonly yongshenService: YongshenService) {}

  @Get(':chartId')
  async getYongshen(@Param('chartId', ParseIntPipe) chartId: number) {
    const result = await this.yongshenService.getYongshen(chartId);
    if (!result) {
      throw new HttpException(
        { type: 'https://bazi.app/errors/chart-not-found', title: '命盘不存在', status: HttpStatus.NOT_FOUND, detail: `chartId=${chartId} 对应的命盘记录不存在` },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}