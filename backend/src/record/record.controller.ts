import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Get,
  Delete,
  Put,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../firebase/firebase.service';
import { memoryStorage } from 'multer';
import { request } from 'http';
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
  @Get('record/user')
  async getRecordsByUser(@Headers('Authorization') token: string) {
    try {
      if (!token) {
        throw new UnauthorizedException('Unauthorized');
      }
      const decodedToken = jwt.decode(token.split(' ')[1]) as jwt.JwtPayload;
      const userId = decodedToken?.id;
      const records = await this.firebaseService.getRecordsByUserId(userId);
      return { message: 'Records retrieved successfully', records };
    } catch (error) {
      return { message: 'Failed to retrieve records', error: error.message };
    }
  }
  @Post('sharedrecords')
  async addSharedRecords(@Body() body: { recordId: string; email: string }) {
    const { recordId, email } = body;
    try {
      await this.firebaseService.addSharedRecords(recordId, email);
      return { message: 'Records shared successfully', recordId };
    } catch (error) {
      return { message: 'Failed to share records', error: error.message };
    }
  }
  @Get('shared/record')
  async getSharedRecords(@Headers('Authorization') token: string) {
    try {
      if (!token) {
        throw new UnauthorizedException('Unauthorized');
      }
      const decodedToken = jwt.decode(token.split(' ')[1]) as jwt.JwtPayload;
      const userId = decodedToken?.id;
      const records = await this.firebaseService.getSharedRecords(userId);
      return { message: 'Shared records retrieved successfully', records };
    } catch (error) {
      return {
        message: 'Failed to retrieve shared records',
        error: error.message,
      };
    }
  }
}
