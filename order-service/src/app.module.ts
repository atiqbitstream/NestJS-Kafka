
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
            brokers: [process.env.EVENT_STREAMS_BROKERS],
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
