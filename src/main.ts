/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './core/transform.interceptor';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://myfrontend.com',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  const globalAuthGuard = app.get(GlobalAuthGuard);

  // Interceptor toàn cục (bạn đã có)
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));

  // Guard toàn cục bảo vệ toàn app, nhưng sẽ bỏ qua routes có @Public()
  app.useGlobalGuards(globalAuthGuard);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
