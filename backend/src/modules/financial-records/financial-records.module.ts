import { Module } from '@nestjs/common';
import { FinancialRecordsController } from './financial-records.controller';
import { FinancialRecordsService } from './financial-records.service';
import { AuthModule } from '../auth/auth.module';
import { FamiliesModule } from '../families/families.module';

@Module({
  imports: [AuthModule, FamiliesModule],
  controllers: [FinancialRecordsController],
  providers: [FinancialRecordsService],
  exports: [FinancialRecordsService],
})
export class FinancialRecordsModule {}
