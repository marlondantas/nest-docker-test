import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as configurações acessíveis globalmente
    }),
    KeycloakConnectModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const authServerUrl = config.get<string>('KEYCLOAK_URL');
        const realm = config.get<string>('KEYCLOAK_REALM');
        const clientId = config.get<string>('KEYCLOAK_CLIENT_ID');
        const secret = config.get<string>('KEYCLOAK_CLIENT_SECRET');

        if (!authServerUrl || !realm || !clientId || !secret) {
          throw new Error('Keycloak configuration is missing');
        }

        console.log('Keycloak configuration  start!');

        return {
          authServerUrl,
          realm,
          clientId,
          secret,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    FileModule,
    // outros módulos ou configurações
  ],
  providers: [
    AppService,
  ],
  controllers: [AppController],
})
export class AppModule {}
