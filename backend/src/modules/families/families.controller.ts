import {
  Controller,
  Post,
  Get,
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
import { FamiliesService } from './families.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { AddFamilyMemberDto } from './dto/add-family-member.dto';
import { GrantFamilyAccessDto } from './dto/grant-family-access.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FamilyRolesGuard } from './guards/family-roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser, AuthenticatedUserPayload } from '../../common/decorators/current-user.decorator';
import { FamilyRole } from '@prisma/client';
import { ApiErrorResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('Families & Access Control')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create Family Workspace',
    description: 'Atomically creates a new family workspace, assigns the creator as PRIMARY_ADMIN, and sets up the primary family member profile.',
  })
  @ApiResponse({
    status: 201,
    description: 'Family workspace created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed.',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    type: ApiErrorResponseDto,
  })
  async createFamily(
    @CurrentUser() user: AuthenticatedUserPayload,
    @Body() dto: CreateFamilyDto,
  ) {
    return this.familiesService.createFamily(user.id, user.fullName, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List User Families',
    description: 'Retrieves all family workspaces where the authenticated user has active membership/access.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of authorized families retrieved.',
  })
  async getUserFamilies(@CurrentUser('id') userId: string) {
    return this.familiesService.getUserFamilies(userId);
  }

  @Get(':familyId')
  @UseGuards(FamilyRolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Family Details',
    description: 'Retrieves comprehensive family workspace details, members, and access grants. Strictly enforces cross-family isolation.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({
    status: 200,
    description: 'Family details retrieved successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — user does not have access to this family.',
    type: ApiErrorResponseDto,
  })
  async getFamilyById(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.familiesService.getFamilyById(familyId, userId);
  }

  @Patch(':familyId')
  @UseGuards(FamilyRolesGuard)
  @Roles(FamilyRole.PRIMARY_ADMIN, FamilyRole.DECISION_MAKER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Family Workspace',
    description: 'Updates family metadata (e.g. name). Requires PRIMARY_ADMIN or DECISION_MAKER role.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({
    status: 200,
    description: 'Family workspace updated successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — insufficient role permissions or cross-family access.',
    type: ApiErrorResponseDto,
  })
  async updateFamily(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Body() dto: UpdateFamilyDto,
  ) {
    return this.familiesService.updateFamily(familyId, dto);
  }

  @Post(':familyId/members')
  @UseGuards(FamilyRolesGuard)
  @Roles(FamilyRole.PRIMARY_ADMIN, FamilyRole.DECISION_MAKER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add Family Member',
    description: 'Registers a family member profile within the family boundary. Requires PRIMARY_ADMIN or DECISION_MAKER role.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({
    status: 201,
    description: 'Family member created successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — unauthorized access.',
    type: ApiErrorResponseDto,
  })
  async addMember(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Body() dto: AddFamilyMemberDto,
  ) {
    return this.familiesService.addMember(familyId, dto);
  }

  @Get(':familyId/members')
  @UseGuards(FamilyRolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List Family Members',
    description: 'Lists all family members belonging strictly to the specified family.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({
    status: 200,
    description: 'Family members list retrieved.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — access denied.',
    type: ApiErrorResponseDto,
  })
  async getMembers(@Param('familyId', ParseUUIDPipe) familyId: string) {
    return this.familiesService.getMembers(familyId);
  }

  @Post(':familyId/access')
  @UseGuards(FamilyRolesGuard)
  @Roles(FamilyRole.PRIMARY_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Grant Family Access / Assign Role',
    description: 'Grants platform access or assigns a role to a registered user for this family. Requires PRIMARY_ADMIN role.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({
    status: 200,
    description: 'Family access granted/updated successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — only PRIMARY_ADMIN can grant family access.',
    type: ApiErrorResponseDto,
  })
  async grantAccess(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Body() dto: GrantFamilyAccessDto,
  ) {
    return this.familiesService.grantAccess(familyId, dto);
  }

  @Get(':familyId/access')
  @UseGuards(FamilyRolesGuard)
  @Roles(FamilyRole.PRIMARY_ADMIN, FamilyRole.DECISION_MAKER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List Family Access Grants',
    description: 'Lists all user access grants and roles for the family. Requires PRIMARY_ADMIN or DECISION_MAKER role.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({
    status: 200,
    description: 'Family access grants list retrieved.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden — unauthorized access.',
    type: ApiErrorResponseDto,
  })
  async getAccessList(@Param('familyId', ParseUUIDPipe) familyId: string) {
    return this.familiesService.getAccessList(familyId);
  }
}
