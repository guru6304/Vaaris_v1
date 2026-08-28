import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthDataDto, HealthResponseDto } from './dto/health-response.dto';
import { ApiErrorResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'System Health Check',
    description: 'Verifies API application status, PostgreSQL database connectivity, environment mode, and uptime.',
  })
  @ApiResponse({
    status: 200,
    description: 'System and database are healthy and operational.',
    type: HealthResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Database connectivity error or degraded system state.',
    type: ApiErrorResponseDto,
  })
  async getHealth(): Promise<HealthDataDto> {
    return this.healthService.checkHealth();
  }
}
