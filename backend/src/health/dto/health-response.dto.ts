import { ApiProperty } from '@nestjs/swagger';

export class HealthDataDto {
  @ApiProperty({ description: 'Application operational status', example: 'ok' })
  status: string;

  @ApiProperty({ description: 'PostgreSQL database connection status', example: 'connected', enum: ['connected', 'disconnected'] })
  database: 'connected' | 'disconnected';

  @ApiProperty({ description: 'Environment name', example: 'development' })
  environment: string;

  @ApiProperty({ description: 'Server current timestamp', example: '2026-08-28T00:45:00.000Z' })
  timestamp: string;

  @ApiProperty({ description: 'Process uptime in seconds', example: 120.45 })
  uptime: number;
}

export class HealthResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: HealthDataDto })
  data: HealthDataDto;
}
