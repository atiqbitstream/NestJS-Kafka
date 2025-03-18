import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from '@nestjs/microservices/external/kafka.interface';

async function bootstrap() {
  // Create a hybrid application
  const app = await NestFactory.create(AppModule);

  // Parse brokers correctly
  let brokers = [];
  try {
    if (process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL) {
      brokers = JSON.parse(process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL);
    }
    console.log('Kafka brokers:', brokers);
  } catch (error) {
    console.error('Error parsing Kafka brokers:', error);
    brokers = process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL?.split(',') || [];
  }

  // Connect the Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'order-service',
        brokers: brokers,
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: process.env.EVENT_STREAMS_USER || '',
          password: process.env.EVENT_STREAMS_PASSWORD || '',
        }
      },
      consumer: {
        groupId: 'order-consumer',
        sessionTimeout: 30000,
        heartbeatInterval: 10000,
        allowAutoTopicCreation: true
      },
      producer: {
        // Use the legacy partitioner for compatibility
        createPartitioner: Partitioners.DefaultPartitioner,
      },
      // Properly handle buffer to string conversion
      deserializer: {
        deserialize(value) {
          if (value === null) return null;
          
          try {
            const message = value.toString();
            return JSON.parse(message);
          } catch (e) {
            console.error('Deserialization error:', e);
            return value;
          }
        }
      },
    }
  });

  // Start both the HTTP server and microservices
  await app.startAllMicroservices();
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
