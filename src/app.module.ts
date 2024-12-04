import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { DinnerModule } from './dinner/dinner.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}`, // Dynamically load .env.dev or .env.test
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        // Define the database configuration object
        const dbConfig: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST', 'localhost'),
          port: configService.get<number>('DATABASE_PORT', 5432),
          username: configService.get<string>('DATABASE_USERNAME', 'k'),
          password: configService.get<string>('DATABASE_PASSWORD', 'k'),
          database: configService.get<string>('DATABASE_NAME', 'strangers_meet_db'),
          autoLoadEntities: true,
          synchronize: configService.get<boolean>('SYNCHRONIZE', true), // Only in dev
          logging: configService.get<boolean>('LOGGING', false), // Log database operations
        };

        // Log the database configuration for debugging
        console.log('TypeORM Database Configuration:', dbConfig);

        // Return the configuration object
        return dbConfig;
      },
    }),
    UserModule,
    DinnerModule,
  ],
})
export class AppModule {}