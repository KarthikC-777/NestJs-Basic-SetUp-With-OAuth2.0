import { Module } from '@nestjs/common';
import { AirTableService } from './air-table.service';
import { AirTableController } from './air-table.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AirTableSkillMatrixDataSchema } from './schema/air-table-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'AirTableSkillMatrixData',
        schema: AirTableSkillMatrixDataSchema,
      },
    ]),
  ],
  providers: [AirTableService],
  controllers: [AirTableController],
  exports: [AirTableService],
})
export class AirTableModule {}
