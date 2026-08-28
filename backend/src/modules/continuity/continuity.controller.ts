import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Body,
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
import { ContinuityService } from './continuity.service';
import { UpdateContinuityPlanDto } from './dto/update-continuity-plan.dto';
import { CreateEmergencyCaseDto } from './dto/create-emergency-case.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FamilyRolesGuard } from '../families/guards/family-roles.guard';
import { Roles } from '../families/decorators/roles.decorator';
import { FamilyRole } from '@prisma/client';

@ApiTags('Continuity & Emergency Cases')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, FamilyRolesGuard)
@Controller('families/:familyId/continuity')
export class ContinuityController {
  constructor(private readonly continuityService: ContinuityService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Family Continuity Plan',
    description: 'Retrieves emergency contacts, designated responsibilities, financial intents, and instructions.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({ status: 200, description: 'Continuity plan retrieved.' })
  async getContinuityPlan(@Param('familyId', ParseUUIDPipe) familyId: string) {
    return this.continuityService.getContinuityPlan(familyId);
  }

  @Put()
  @Roles(FamilyRole.PRIMARY_ADMIN, FamilyRole.DECISION_MAKER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Family Continuity Plan',
    description: 'Updates emergency contacts, responsibilities, and continuity directives.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({ status: 200, description: 'Continuity plan updated.' })
  async updateContinuityPlan(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Body() dto: UpdateContinuityPlanDto,
  ) {
    return this.continuityService.updateContinuityPlan(familyId, dto);
  }

  @Get('emergency-cases')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List Emergency Cases',
    description: 'Retrieves active and resolved crisis cases for the family.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({ status: 200, description: 'Emergency cases retrieved.' })
  async getEmergencyCases(@Param('familyId', ParseUUIDPipe) familyId: string) {
    return this.continuityService.getEmergencyCases(familyId);
  }

  @Post('emergency-cases')
  @Roles(FamilyRole.PRIMARY_ADMIN, FamilyRole.DECISION_MAKER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Emergency Case',
    description: 'Initiates a crisis respond case and auto-populates relevant claim tasks.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({ status: 201, description: 'Emergency case opened.' })
  async createEmergencyCase(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Body() dto: CreateEmergencyCaseDto,
  ) {
    return this.continuityService.createEmergencyCase(familyId, dto);
  }

  @Get('claims')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List Family Claims',
    description: 'Retrieves all claims and step-by-step progress tracking.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({ status: 200, description: 'Claims list retrieved.' })
  async getClaims(@Param('familyId', ParseUUIDPipe) familyId: string) {
    return this.continuityService.getClaims(familyId);
  }

  @Patch('claims/:claimId/step')
  @Roles(FamilyRole.PRIMARY_ADMIN, FamilyRole.DECISION_MAKER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete Claim Step',
    description: 'Marks a milestone step as complete and advances claim progress.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiParam({ name: 'claimId', description: 'UUID of the claim' })
  @ApiResponse({ status: 200, description: 'Claim step updated.' })
  async completeClaimStep(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Param('claimId', ParseUUIDPipe) claimId: string,
    @Body('stepId') stepId: string,
  ) {
    return this.continuityService.completeClaimStep(familyId, claimId, stepId);
  }
}
