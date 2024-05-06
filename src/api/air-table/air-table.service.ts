import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as Airtable from 'airtable';
import { AirTableSkillMatrixData } from './schema/air-table-data.schema';
import mongoose from 'mongoose';
import { logger } from '../../config/logger';
import { getLoggerPrefix } from '../../utils/logger-debug.util';
@Injectable()
export class AirTableService {
  private base: Airtable.Base;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(AirTableSkillMatrixData.name)
    private readonly airTableModel: mongoose.Model<AirTableSkillMatrixData | null>,
  ) {
    const accessToken = this.configService.get<string>('AIRTABLE_ACCESS_TOKEN');
    const baseId = this.configService.get<string>('AIRTABLE_BASE_ID');

    // Initialize Airtable with your access token and base ID
    const airtableConfig = {
      endpointUrl: this.configService.get<string>('AIRTABLE_END_POINT_URL'),
      apiKey: accessToken, // You can specify the access token in the apiKey field
    };

    this.base = new Airtable(airtableConfig).base(baseId);
  }

  async airTableSkillMatrix(): Promise<void> {
    logger.log(`${getLoggerPrefix()}:Inside AirTable to Database Sync`);

    const tableName = 'skill_matrix';
    await this.getRecords(tableName);
  }

  // Method to fetch records from a specific table
  async getRecords(tableName: string) {
    // Create an array to store skill matrix data and process in batches
    const skillMatrixDetailsArray: AirTableSkillMatrixData[] = [];

    await this.base(tableName)
      .select()
      .eachPage(async (pageRecords, fetchNextPage) => {
        // Collect records in an array
        pageRecords.forEach((eachRecord) => {
          const skillMatrixDetails: AirTableSkillMatrixData = {
            emp_id: eachRecord.fields['Emp ID'] as string,
            name: eachRecord.fields['Name'] as string,
            current_project: eachRecord.fields['Current project'] as string,
            experience: eachRecord.fields[
              'Total Years of Experience'
            ] as number,
            job_title: eachRecord.fields['Job Title'] as string,
          };

          skillMatrixDetailsArray.push(skillMatrixDetails);
        });

        // Process records in batches
        if (skillMatrixDetailsArray.length > 0) {
          await this.processBatch(skillMatrixDetailsArray);
          // Clear the array after processing
          skillMatrixDetailsArray.length = 0;
        }

        fetchNextPage();
      });
  }

  // Function to process a batch of skill matrix details
  private async processBatch(batch: AirTableSkillMatrixData[]): Promise<void> {
    for (const skillMatrixDetails of batch) {
      // eslint-disable-next-line no-await-in-loop
      await this.upsertEmployeeSkillMatrix(skillMatrixDetails);
    }
  }

  // Function to insert or update an employee document
  private async upsertEmployeeSkillMatrix(
    employeeSkillMatrixData: AirTableSkillMatrixData,
  ): Promise<void> {
    const { emp_id } = employeeSkillMatrixData;
    logger.log(
      `${getLoggerPrefix()}: Validating Skill Matrix for Emp ID- ${emp_id}`,
    );

    // Check if an employee with the given emp_id already exists in the database
    const existingEmployee = await this.airTableModel.findOne({ emp_id });

    if (existingEmployee) {
      logger.log(
        `${getLoggerPrefix()}: Emp ID- ${emp_id} already exists, updating the database`,
      );
      // Update the existing employee document with the new data
      await this.airTableModel.findByIdAndUpdate(
        existingEmployee._id,
        employeeSkillMatrixData,
        { new: true },
      );
    } else {
      logger.log(
        `${getLoggerPrefix()}: Creating a new document for skill matrix synchronization in the database for Emp ID ${emp_id}`,
      );
      // Insert a new employee document
      const newEmployee = new this.airTableModel(employeeSkillMatrixData);
      await newEmployee.save();
    }
  }
}
