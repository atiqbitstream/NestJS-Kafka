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
  this.kafkaclient.emit('user.created', {
    value: JSON.stringify(data) // Correctly wraps data in 'value'
  });
  return { message: 'User created', data };
}
}