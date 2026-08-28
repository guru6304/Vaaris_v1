import {
  Controller,
  Post,
  Get,
  Delete,
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
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FamilyRolesGuard } from '../families/guards/family-roles.guard';
import { Roles } from '../families/decorators/roles.decorator';
import { FamilyRole } from '@prisma/client';
import { ApiErrorResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('Document Vault')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, FamilyRolesGuard)
@Controller('families/:familyId/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(FamilyRole.PRIMARY_ADMIN, FamilyRole.DECISION_MAKER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload Document Metadata',
    description: 'Catalogs a new document record into the family secure vault.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({ status: 201, description: 'Document catalogued.' })
  @ApiResponse({ status: 403, description: 'Forbidden.', type: ApiErrorResponseDto })
  async createDocument(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentsService.createDocument(familyId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List Family Documents',
    description: 'Retrieves all catalogued vault documents for the family.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiResponse({ status: 200, description: 'List of documents retrieved.' })
  async getDocuments(@Param('familyId', ParseUUIDPipe) familyId: string) {
    return this.documentsService.getDocuments(familyId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get Document Details',
    description: 'Retrieves a single vault document metadata record.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiParam({ name: 'id', description: 'UUID of the document' })
  @ApiResponse({ status: 200, description: 'Document retrieved.' })
  @ApiResponse({ status: 404, description: 'Document not found.', type: ApiErrorResponseDto })
  async getDocumentById(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.documentsService.getDocumentById(familyId, id);
  }

  @Delete(':id')
  @Roles(FamilyRole.PRIMARY_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Document',
    description: 'Removes a document from the family vault.',
  })
  @ApiParam({ name: 'familyId', description: 'UUID of the family workspace' })
  @ApiParam({ name: 'id', description: 'UUID of the document' })
  @ApiResponse({ status: 200, description: 'Document deleted.' })
  async deleteDocument(
    @Param('familyId', ParseUUIDPipe) familyId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.documentsService.deleteDocument(familyId, id);
  }
}
