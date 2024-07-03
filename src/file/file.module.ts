import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { FileRecord } from './file.entity';
import { FileController } from './file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FileRecord])],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
