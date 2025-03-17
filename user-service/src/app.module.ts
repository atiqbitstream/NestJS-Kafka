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
            brokers: JSON.parse(process.env.EVENT_STREAMS_KAFKA_BROKERS_SASL),
            ssl:true,
            sasl:{
              mechanism:'plain',
              username: process.env.EVENT_STREAMS_USER,
              password: process.env.EVENT_STREAMS_PASSWORD,
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
