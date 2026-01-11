import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { nestCsrf } from 'ncsrf';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(helmet());
  app.use(cookieParser());
  app.use(nestCsrf());

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error);
