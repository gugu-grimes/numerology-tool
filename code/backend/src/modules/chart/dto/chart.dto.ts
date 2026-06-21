import { IsInt, IsString, IsOptional, IsDateString, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalculateChartDto {
  @ApiProperty({ description: '输入方式', enum: ['solar', 'lunar'], example: 'solar' })
  @IsEnum(['solar', 'lunar'])
  birthDateType: 'solar' | 'lunar';

  @ApiPropertyOptional({ description: '公历出生日期时间（ISO 8601）', example: '1990-06-15T14:30:00Z' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ description: '性别', enum: ['male', 'female'], example: 'male' })
  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';

  @ApiPropertyOptional({ description: '农历出生信息' })
  @IsOptional()
  @ValidateNested()
  @Type(() => LunarBirthInfoDto)
  lunarBirthInfo?: LunarBirthInfoDto;

  @ApiPropertyOptional({ description: '子时处理方式', enum: ['early_zi', 'late_zi'], default: 'early_zi' })
  @IsOptional()
  @IsEnum(['early_zi', 'late_zi'])
  zhourule?: 'early_zi' | 'late_zi';
}

export class LunarBirthInfoDto {
  @ApiProperty({ description: '农历年', example: 1990 })
  @IsInt()
  year: number;

  @ApiProperty({ description: '农历月', example: 5 })
  @IsInt()
  month: number;

  @ApiProperty({ description: '农历日', example: 23 })
  @IsInt()
  day: number;

  @ApiPropertyOptional({ description: '是否闰月', default: false })
  @IsOptional()
  isLeapMonth?: boolean;
}

export class GetChartParamsDto {
  @ApiProperty({ description: '命盘 ID', example: 1 })
  @IsInt()
  @Type(() => Number)
  id: number;
}