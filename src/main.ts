import {
  ClassSerializerInterceptor,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // use pipes to perform input validation
  // use whitelist to filter unnecessary fields from client requests
  // whitelist will filter all fields without validation decorators, even if they are defined in th DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // use interceptors to execute extra logic before and after the router handler is executed
  // use ClassSerializerInterceptor to serialize the response
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // apply the exception filter to the entire application
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      // Prisma Error Code: HTTP Status ResponseCode: HTTP Status Response
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  );

  app.use(LoggingMiddleware);

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') ?? 3000;

  await app.listen(port);
}
bootstrap();
