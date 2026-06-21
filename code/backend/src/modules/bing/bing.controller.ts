import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { BingService } from './bing.service';

@Controller('bing')
export class BingController {
  constructor(private readonly bingService: BingService) {}

  @Get(':chartId')
  async diagnose(@Param('chartId', ParseIntPipe) chartId: number) {
    const result = await this.bingService.diagnose(chartId);
    if (!result) {
      throw new HttpException(
        { type: 'https://bazi.app/errors/chart-not-found', title: '命盘不存在', status: HttpStatus.NOT_FOUND, detail: `chartId=${chartId} 对应的命盘记录不存在` },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}