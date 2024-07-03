import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import * as crypto from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';

import { Get, Param } from '@nestjs/common';
import { Response } from 'express';

@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get(':userUuid')
  async findAllFiles(@Param('userUuid') userUuid: string) {
    const files = await this.fileService.findAllFiles(userUuid);
    return files;
  }

  @Get(':userUuid/:id/download')
  async downloadFile(
    @Param('userUuid') userUuid: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { stream, record } = await this.fileService.getFileById(id);
    // Verificar se o arquivo pertence ao usuário requisitante
    if (record.userUuid !== userUuid) {
      return res.status(403).send('Access denied');
    }
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${record.originalFileName}"`,
    );
    stream.pipe(res);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createRecord(
    @UploadedFile() file: Express.Multer.File,
    @Body('userUuid') userUuid: string,
  ) {
    const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    // Gera um UUID para o novo arquivo
    const newFileUuid = crypto.randomUUID();
    const filePath = join(__dirname, '..', 'uploads', newFileUuid); // Usa o UUID gerado como nome do arquivo

    // Salva o arquivo no diretório desejado com o novo nome
    writeFileSync(filePath, file.buffer);

    const record = await this.fileService.createRecord(
      userUuid,
      hash,
      filePath,
      file.originalname,
    );
    return record;
  }
}
