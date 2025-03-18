import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Controller('users')
export class UserController
{
    constructor(@Inject('KAFKA_SERVICE') private readonly kafkaclient: ClientKafka)
    {}

    // user.controller.ts (User-service)
@Post('create')
async createUser(@Body() data: { id: string; name: string }) {
  console.log('Emitting:', data);
  this.kafkaclient.emit('user.created', JSON.stringify(data)); 
  return { message: 'user created', data };
}
}