import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Get,
  Delete,
  Put
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../firebase/firebase.service';
import { memoryStorage } from 'multer';
class UpdateNameDto {
  recordId: string;
  newName: string;
}
class CreateRecordDto {
  name: string;
  date: string;
  userId: string;
  file: Express.Multer.File;
}

@Controller('record')
export class RecordController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('save_record')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async saveRecord(
    @UploadedFile() file: Express.Multer.File,
    @Body() createRecordDto: CreateRecordDto,
  ): Promise<{ message: string; recordId?: string; error?: string }> {
    const { name, date, userId } = createRecordDto;
    const uniqueFileName = `video_${Date.now()}.mp4`;
    try {
      const fileUrl = await this.firebaseService.uploadFile(
        `videos/${uniqueFileName}`,
        file.buffer,
      );

      const recordId = await this.firebaseService.addRecord(
        fileUrl,
        name,
        date,
        userId,
      );

      return {
        message: 'Record saved successfully.',
        recordId,
      };
    } catch (error) {
      return {
        message: 'Failed to save record',
        error: error.message,
      };
    }
  }
  @Get(':recordId')
  async getRecordById(
    @Param('recordId') recordId: string,
  ): Promise<{ message: string; record?: any; error?: string }> {
    try {
      const record = await this.firebaseService.getRecord(recordId);
      return {
        message: 'Record retrieved successfully.',
        record,
      };
    } catch (error) {
      return {
        message: 'Failed to retrieve record',
        error: error.message,
      };
    }
  }
  @Delete('deleterecord')
  async deleteRecord(@Body() body: { recordId: string }) {
    const { recordId } = body;
    try {
      await this.firebaseService.deleteRecord(recordId);
      return { message: 'Record deleted successfully', recordId };
    } catch (error) {
      return { message: 'Failed to delete record', error: error.message };
    }
  }
  @Put('changename')
  async changeName(@Body() body: UpdateNameDto) {
    const { recordId, newName } = body;
    try {
      await this.firebaseService.updateRecordName(recordId, newName);
      return { message: 'Name updated successfully', recordId };
    } catch (error) {
      return { message: 'Failed to update name', error: error.message };
    }
  }
}
