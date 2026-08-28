import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import type { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  @ApiExcludeEndpoint()
  root(@Res() res: Response) {
    return res.redirect('/api/docs');
  }
}
