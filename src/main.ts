import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { readFileSync } from 'fs';
import {
  API_GLOBAL_PREFIX,
  HTTPS_ENABLE,
  PORT,
  SSL_CERT,
  SSL_KEY,
} from './common/constant/config';
import { AllowPrivateNetworkMiddleware } from './common/middlewares/allow-private-network.middleware';
import { LoggingHttpMiddleware } from './common/middlewares/logging-http.middleware';
import { AppModule } from './modules/app/app.module';
import { getConfiguration } from './utils/config';
import { PrismaExceptionFilter } from './common/exceptions/prisma-exception.filter';

async function bootstrap() {
  // get configuration
  const getConfigByKeys = getConfiguration();
  const config = getConfigByKeys(
    API_GLOBAL_PREFIX,
    PORT,
    HTTPS_ENABLE,
    SSL_KEY,
    SSL_CERT,
  );

  const apiGlobalPrefix = config[API_GLOBAL_PREFIX];
  const port = config[PORT];

  const useHttps = config[HTTPS_ENABLE];
  const sslKeyPath = config[SSL_KEY];
  const sslCertPath = config[SSL_CERT];

  // https
  const httpsOptions = useHttps
    ? { key: readFileSync(sslKeyPath), cert: readFileSync(sslCertPath) }
    : null;

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  // use pipes to perform input validation
  // use whitelist to filter unnecessary fields from client requests
  // whitelist will filter all fields without validation decorators, even if they are defined in th DTO
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // use interceptors to execute extra logic before and after the router handler is executed
  // use ClassSerializerInterceptor to serialize the response
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // use exception filter to handle application errors
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));

  // use middlewares
  app.use(LoggingHttpMiddleware, AllowPrivateNetworkMiddleware);

  // set global prefix
  app.setGlobalPrefix(apiGlobalPrefix);

  // enable cors
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
