import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { WangShuaiService } from './wangshuai.service';

@Controller('analysis/wangshuai')
export class WangShuaiController {
  constructor(private readonly wangShuaiService: WangShuaiService) {}

  @Get(':chartId')
  async getWangShuai(@Param('chartId', ParseIntPipe) chartId: number) {
    const result = await this.wangShuaiService.getWangShuai(chartId);
    if (!result) {
      throw new HttpException(
        { type: 'https://bazi.app/errors/chart-not-found', title: '命盘不存在', status: HttpStatus.NOT_FOUND, detail: `chartId=${chartId} 对应的命盘记录不存在` },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}