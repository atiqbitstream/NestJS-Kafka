import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport:Transport.KAFKA,
    options:{
      client:{
        brokers: [process.env.EVENT_STREAMS_BROKERS],
        ssl:true,
        sasl:{
         mechanism: 'plain',
         username:process.env.KAFKA_USERNAME,
         password:process.env.KAFKA_PASSWORD,
        },
      },
      consumer:{
        groupId: 'user-consumer'
      }
    }
  });
  await app.listen();
  
}
bootstrap();
