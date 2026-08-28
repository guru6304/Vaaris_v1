import { ApiProperty } from '@nestjs/swagger';

export class ApiMetaDto {
  @ApiProperty({ description: 'Unique traceable request ID', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  requestId: string;

  @ApiProperty({ description: 'ISO 8601 Timestamp', example: '2026-08-28T00:45:00.000Z' })
  timestamp: string;
}

export class ApiPaginationDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class ApiErrorDetailDto {
  @ApiProperty({ required: false, example: 'email' })
  field?: string;

  @ApiProperty({ example: 'email must be an email address' })
  message: string;

  @ApiProperty({ required: false, example: 'isEmail' })
  code?: string;
}

export class ApiErrorPayloadDto {
  @ApiProperty({ example: 'VALIDATION_FAILED' })
  code: string;

  @ApiProperty({ example: 'Request validation failed' })
  message: string;

  @ApiProperty({ type: [ApiErrorDetailDto], required: false })
  details?: ApiErrorDetailDto[];
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ type: ApiErrorPayloadDto })
  error: ApiErrorPayloadDto;

  @ApiProperty({ type: ApiMetaDto })
  meta: ApiMetaDto;
}
