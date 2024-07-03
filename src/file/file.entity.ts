import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FileRecord {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userUuid: string;

  @Column()
  shaHash: string;

  @Column()
  filePath: string;

  @Column()
  originalFileName: string;

  @CreateDateColumn()
  createdAt: Date;
}
