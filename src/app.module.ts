import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DinnerModule } from './dinner/dinner.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // TypeORM Database Connection Configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Replace with your PostgreSQL host
      port: 5432, // Default PostgreSQL port
      username: 'k', // Your PostgreSQL username
      password: 'k', // Your PostgreSQL password
      database: 'strangers_meet_db', // Your PostgreSQL database name
      autoLoadEntities: true, // Automatically load all entities in the project
      synchronize: true, // Automatically synchronize database schema (disable in production)
    }),

    // Feature modules
    UserModule,
    DinnerModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}