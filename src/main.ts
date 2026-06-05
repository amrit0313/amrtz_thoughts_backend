import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

function formatValidationErrors(
  errors: any[],
): Array<{ field: string; message: string }> {
  return errors.flatMap((error) => {
    const fieldErrors = Object.values(error.constraints ?? {}).map(
      (message) => ({
        field: error.property,
        message: String(message),
      }),
    );

    const nestedErrors = error.children?.length
      ? formatValidationErrors(error.children)
      : [];

    return [...fieldErrors, ...nestedErrors];
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  const corsOrigins = ['http://localhost:3000'];

  if (frontendUrl) {
    corsOrigins.push(frontendUrl);
  }

  // Enable CORS
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException({
          message: 'Validation failed',
          details: formatValidationErrors(errors),
        }),
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
