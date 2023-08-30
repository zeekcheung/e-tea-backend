import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { readFileSync } from 'fs';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import {
  API_GLOBAL_PREFIX,
  HTTPS_ENABLE,
  PORT,
  SSL_CERT,
  SSL_KEY,
} from './common/constant/config';
import { ERROR_CODES_MAPPING } from './common/exceptions/prisma-exceptions';
import { AllowPrivateNetworkMiddleware } from './common/middlewares/allow-private-network.middleware';
import { LoggingHttpMiddleware } from './common/middlewares/logging-http.middleware';
import { AppModule } from './modules/app/app.module';
import { getConfiguration } from './utils/config';

async function bootstrap() {
  // 读取配置
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

  // apply the exception filter to the entire application
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, ERROR_CODES_MAPPING),
  );

  // 注册全局中间件
  app.use(LoggingHttpMiddleware, AllowPrivateNetworkMiddleware);

  // 设置全局路由前缀
  app.setGlobalPrefix(apiGlobalPrefix);

  // 开启 CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
