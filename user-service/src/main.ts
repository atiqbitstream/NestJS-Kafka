import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create a hybrid application
  const app = await NestFactory.create(AppModule);
  
  // Parse brokers correctly - the environment variable contains a JSON array
  let brokers = [];
  try {
    // If it's a JSON string, parse it
    if (process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL) {
      brokers = JSON.parse(process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL);
    }
    console.log('Kafka brokers:', brokers);
  } catch (error) {
    console.error('Error parsing Kafka brokers:', error);
    // Fallback: If it's not valid JSON, try comma-separated format
    brokers = process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL?.split(',') || [];
  }
  
  // Connect the Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: brokers,
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: process.env.EVENT_STREAMS_USER || '',
          password: process.env.EVENT_STREAMS_PASSWORD || '',
        }
      },
      consumer: {
        groupId: 'user-consumer',
        sessionTimeout: 30000,     // Increase session timeout
        heartbeatInterval: 10000,  // Adjust heartbeat frequency
        allowAutoTopicCreation: true // Auto-create topics if missing
      },
      serializer: {
        serialize(value) {
          return Buffer.from(JSON.stringify(value));
        },
      },
      deserializer: {
        deserialize(value) {
          return JSON.parse(value.toString());
        },
      },
    }
  });
    
  // Start both the HTTP server and microservices
  await app.startAllMicroservices();
  await app.listen(3000, '0.0.0.0');
  
}
bootstrap();
