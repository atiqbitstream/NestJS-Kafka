import { Kafka } from './../../user-service/node_modules/kafkajs/types/index.d';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderController } from './order.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options:{
          client:{
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'order-consumer',
          }
        }
      }
    ])
  ],
  controllers: [OrderController],
  providers: [AppService],
})
export class AppModule {}
