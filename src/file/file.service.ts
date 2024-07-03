import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileRecord } from './file.entity';
import { createReadStream } from 'fs';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileRecord)
    private fileRepository: Repository<FileRecord>,
  ) {}

  async createRecord(
    userUuid: string,
    shaHash: string,
    filePath: string,
    originalFileName: string,
  ): Promise<FileRecord> {
    const record = this.fileRepository.create({
      userUuid,
      shaHash,
      filePath,
      originalFileName,
    });
    return this.fileRepository.save(record);
  }

  async findAllFiles(userUuid: string): Promise<FileRecord[]> {
    return this.fileRepository.find({ where: { userUuid } });
  }

  async getFileById(
    id: string,
  ): Promise<{ stream: NodeJS.ReadableStream; record: FileRecord }> {
    const record = await this.fileRepository.findOne({ where: { id } });

    if (!record) {
      throw new NotFoundException('File not found');
    }

    const stream = createReadStream(record.filePath);
    return { stream, record };
  }
}
