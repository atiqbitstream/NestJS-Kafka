import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';
import { Partitioners } from '@nestjs/microservices/external/kafka.interface';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order-service-client',
            brokers: JSON.parse(process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL),
          },
          consumer: {
            groupId: 'order-consumer',
          },
          // producer: {
          //   // Use the legacy partitioner for compatibility
          //   createPartitioner: Partitioners.DefaultPartitioner,
          // },
          // deserializer: {
          //   deserialize(value) {
          //     if (value === null) return null;
              
          //     try {
          //       const message = value.toString();
          //       return JSON.parse(message);
          //     } catch (e) {
          //       console.error('Deserialization error:', e);
          //       return value;
          //     }
          //   }
          // },
        }
      }
    ])
  ],
  controllers: [OrderController],
  providers: [AppService],
})
export class AppModule {}