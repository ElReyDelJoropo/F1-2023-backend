import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configservice = app.get(ConfigService);
  const port = configservice.get('port');

  await app.listen(port);
}
bootstrap();
