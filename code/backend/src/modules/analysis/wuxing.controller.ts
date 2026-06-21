import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { WuxingService } from './wuxing.service';

@Controller('analysis/wuxing')
export class WuxingController {
  constructor(private readonly wuxingService: WuxingService) {}

  @Get(':chartId')
  async getWuxing(@Param('chartId', ParseIntPipe) chartId: number) {
    const result = await this.wuxingService.getWuxing(chartId);
    if (!result) {
      throw new HttpException(
        { type: 'https://bazi.app/errors/chart-not-found', title: '命盘不存在', status: HttpStatus.NOT_FOUND, detail: `chartId=${chartId} 对应的命盘记录不存在` },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}