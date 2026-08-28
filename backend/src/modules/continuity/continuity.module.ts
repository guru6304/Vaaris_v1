import { Module } from '@nestjs/common';
import { ContinuityController } from './continuity.controller';
import { ContinuityService } from './continuity.service';
import { AuthModule } from '../auth/auth.module';
import { FamiliesModule } from '../families/families.module';

@Module({
  imports: [AuthModule, FamiliesModule],
  controllers: [ContinuityController],
  providers: [ContinuityService],
  exports: [ContinuityService],
})
export class ContinuityModule {}
