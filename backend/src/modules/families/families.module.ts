import { Module } from '@nestjs/common';
import { FamiliesController } from './families.controller';
import { FamiliesService } from './families.service';
import { FamilyRolesGuard } from './guards/family-roles.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FamiliesController],
  providers: [FamiliesService, FamilyRolesGuard],
  exports: [FamiliesService, FamilyRolesGuard],
})
export class FamiliesModule {}
