import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.KAFKA,
    options:{
      client: {
        brokers: [process.env.EVENT_STREAMS_BROKERS]
      },
      consumer: {
        groupId: 'order-consumer'
      }
    }
  });

  await app.listen;
}
bootstrap();
