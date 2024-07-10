import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import * as crypto from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { Get, Param } from '@nestjs/common';

import { Response, Request } from 'express';

import { AuthGuard } from 'nest-keycloak-connect';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

import * as jwt from 'jsonwebtoken';
import { GetUserUuid } from 'src/common/decorators/uuid.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FileController {
  constructor(
    private fileService: FileService,
    private configService: ConfigService,
  ) {}

  @Get('')
  async findUuid(@GetUserUuid() userUuid: string): Promise<any> {
    return this.findAllFiles(userUuid);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createRecord(
    @UploadedFile() file: Express.Multer.File,
    @GetUserUuid() userUuid: string,
  ) {
    const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');
    const newFileUuid = crypto.randomUUID();

    // Usa o ConfigService para obter o diretório de uploads do .env
    const uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');

    // Verifica se o diretório existe, se não, cria
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, newFileUuid); // Usa o diretório configurável

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

  async findAllFiles(@Param('userUuid') userUuid: string) {
    const files = await this.fileService.findAllFiles(userUuid);
    return files;
  }

  @Get(':id/download')
  async downloadFile(
    @GetUserUuid() userUuid: string,
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
}
