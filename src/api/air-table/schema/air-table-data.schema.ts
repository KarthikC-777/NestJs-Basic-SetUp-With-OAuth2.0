import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class AirTableSkillMatrixData {
  @Prop()
  emp_id: string;

  @Prop()
  name: string;

  @Prop()
  current_project: string;

  @Prop()
  experience: number;

  @Prop()
  job_title: string;
}
export const AirTableSkillMatrixDataSchema = SchemaFactory.createForClass(
  AirTableSkillMatrixData,
);
