import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FamilyRolesGuard } from '../families/guards/family-roles.guard';

@ApiTags('Dashboard & Readiness Metrics')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, FamilyRolesGuard)
@Controller('families/:familyId/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Live Dashboard Metrics & Readiness Breakdown',
    description: 'Computes real-time net worth, nominee readiness coverage, category scores, and attention items.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({ status: 200, description: 'Live dashboard metrics retrieved.' })
  async getDashboardSummary(@Param('familyId', ParseUUIDPipe) familyId: string) {
    return this.dashboardService.getDashboardSummary(familyId);
  }
}
