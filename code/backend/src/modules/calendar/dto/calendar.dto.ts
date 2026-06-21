import { IsEnum, IsInt, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LunarSolarConvertDto {
  @ApiProperty({ description: '转换方向', enum: ['lunar2solar', 'solar2lunar'] })
  @IsEnum(['lunar2solar', 'solar2lunar'])
  direction: 'lunar2solar' | 'solar2lunar';

  @ApiProperty({ description: '年', example: 1990 })
  @IsInt()
  @Type(() => Number)
  year: number;

  @ApiProperty({ description: '月', example: 5 })
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: number;

  @ApiProperty({ description: '日', example: 23 })
  @IsInt()
  @Min(1)
  @Max(31)
  @Type(() => Number)
  day: number;

  @ApiPropertyOptional({ description: '是否闰月', default: false })
  @IsOptional()
  @IsBoolean()
  isLeapMonth?: boolean;
}

export class JieqiQueryDto {
  @ApiPropertyOptional({ description: '查询年份', example: 1990 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  @Type(() => Number)
  year?: number;
}