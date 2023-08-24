import {
  ClassSerializerInterceptor,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { readFileSync } from 'fs';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import {
  API_GLOBAL_PREFIX,
  HTTPS_ENABLE,
  PORT_KEY,
  SSL_CERT,
  SSL_KEY,
  getConfiguration,
} from './config/configuration';
import { AllowPrivateNetworkMiddleware } from './middlewares/allow-private-network.middleware';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  // 读取配置
  const getConfigByKeys = getConfiguration();
  const config = getConfigByKeys(
    API_GLOBAL_PREFIX,
    PORT_KEY,
    HTTPS_ENABLE,
    SSL_KEY,
    SSL_CERT,
  );

  const apiGlobalPrefix = config[API_GLOBAL_PREFIX];
  const port = config[PORT_KEY];

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

  // 注册全局中间件
  app.use(LoggingMiddleware, AllowPrivateNetworkMiddleware);

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
