import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { JiXiongService } from './jixiong.service';

@Controller('jixiong')
export class JiXiongController {
  constructor(private readonly jiXiongService: JiXiongService) {}

  @Get(':chartId')
  async getJiXiong(@Param('chartId', ParseIntPipe) chartId: number) {
    const result = await this.jiXiongService.getJiXiong(chartId);
    if (!result) {
      throw new HttpException(
        { type: 'https://bazi.app/errors/chart-not-found', title: '命盘不存在', status: HttpStatus.NOT_FOUND, detail: `chartId=${chartId} 对应的命盘记录不存在` },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}