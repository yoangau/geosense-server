import { NestFactory } from '@nestjs/core';
import { AuthSocketIOAdapter } from './adapters/auth-socket-io.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new AuthSocketIOAdapter(app));
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
