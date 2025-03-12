import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options:{
          client:{
            brokers: [process.env.EVENT_STREAMS_BROKERS],
            ssl:true,
            sasl:{
              mechanism:'plain',
              username: process.env.KAFKA_USERNAME,
              password: process.env.KAFKA_PASSWORD,
            }
          },
          consumer:{
            groupId: 'user-consumer'
          }
        }
      }
    ])
  ],
  controllers: [UserController],
  providers: [AppService],
})
export class AppModule {}
