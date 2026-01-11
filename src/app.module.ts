import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import configuration, { schema } from '@/configuration';
import { DatabaseModule } from '@/database/database.module';
import { LoggerModule } from '@/logger/logger.module';
import { StudentsModule } from '@/students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schema,
      load: [configuration],
    }),
    LoggerModule,
    DatabaseModule,
    StudentsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
