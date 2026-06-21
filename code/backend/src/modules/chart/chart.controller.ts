import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ChartService } from './chart.service';
import { CalculateChartDto } from './dto/chart.dto';

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  /**
   * POST /api/chart/calculate
   * 接收出生信息，计算并返回完整排盘结果
   */
  @Post('calculate')
  async calculate(@Body() dto: CalculateChartDto) {
    const result = await this.chartService.calculate(dto);
    return result;
  }

  /**
   * GET /api/chart/:id
   * 按 ID 获取已保存的排盘结果
   */
  @Get(':id')
  async getChart(@Param('id', ParseIntPipe) id: number) {
    const chart = await this.chartService.getChart(id);
    if (!chart) {
      throw new HttpException(
        {
          type: 'https://bazi.app/errors/chart-not-found',
          title: '命盘不存在',
          status: HttpStatus.NOT_FOUND,
          detail: `chartId=${id} 对应的命盘记录不存在`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return chart;
  }
}