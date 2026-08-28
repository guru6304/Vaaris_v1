import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Put,
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
import { FinancialRecordsService } from './financial-records.service';
import { CreateFinancialRecordDto } from './dto/create-financial-record.dto';
import { UpdateFinancialRecordDto } from './dto/update-financial-record.dto';
import { UpdateNomineesDto } from './dto/update-nominees.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FamilyRolesGuard } from '../families/guards/family-roles.guard';
import { Roles } from '../families/decorators/roles.decorator';
import { FamilyRole } from '@prisma/client';
import { ApiErrorResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('Financial Records & Nominees')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, FamilyRolesGuard)
@Controller('families/:familyId/records')
export class FinancialRecordsController {
  constructor(private readonly recordsService: FinancialRecordsService) {}

  @Post()
  @Roles(FamilyRole.PRIMARY_ADMIN, FamilyRole.DECISION_MAKER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Financial Record',
    description: 'Adds an asset or liability record with optional initial nominees to the family repository.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({ status: 201, description: 'Financial record created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden — unauthorized access.', type: ApiErrorResponseDto })
  async createRecord(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Body() dto: CreateFinancialRecordDto,
  ) {
    return this.recordsService.createRecord(familyId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List Family Financial Records',
    description: 'Retrieves all assets, liabilities, and nominee allocations for the family.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({ status: 200, description: 'Financial records retrieved.' })
  async getRecords(@Param('familyId', ParseUUIDPipe) familyId: string) {
    return this.recordsService.getRecords(familyId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Financial Record Details',
    description: 'Retrieves a single asset or liability with complete nominee mappings.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiParam({ name: 'id', description: 'UUID of the financial record' })
  @ApiResponse({ status: 200, description: 'Financial record details retrieved.' })
  @ApiResponse({ status: 404, description: 'Record not found.', type: ApiErrorResponseDto })
  async getRecordById(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.recordsService.getRecordById(familyId, id);
  }

  @Patch(':id')
  @Roles(FamilyRole.PRIMARY_ADMIN, FamilyRole.DECISION_MAKER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Financial Record',
    description: 'Updates valuation, details, or metadata of an existing record.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiParam({ name: 'id', description: 'UUID of the financial record' })
  @ApiResponse({ status: 200, description: 'Financial record updated.' })
  async updateRecord(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFinancialRecordDto,
  ) {
    return this.recordsService.updateRecord(familyId, id, dto);
  }

  @Delete(':id')
  @Roles(FamilyRole.PRIMARY_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Financial Record',
    description: 'Removes a financial record and associated nominees from the active inventory.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiParam({ name: 'id', description: 'UUID of the financial record' })
  @ApiResponse({ status: 200, description: 'Financial record deleted.' })
  async deleteRecord(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.recordsService.deleteRecord(familyId, id);
  }

  @Put(':id/nominees')
  @Roles(FamilyRole.PRIMARY_ADMIN, FamilyRole.DECISION_MAKER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Nominees for Record',
    description: 'Replaces nominee allocations and updates the verification status of a financial record.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiParam({ name: 'id', description: 'UUID of the financial record' })
  @ApiResponse({ status: 200, description: 'Nominees updated successfully.' })
  async updateNominees(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNomineesDto,
  ) {
    return this.recordsService.updateNominees(familyId, id, dto);
  }
}
