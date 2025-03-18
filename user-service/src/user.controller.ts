import { Body, Controller, Inject, Logger, Post } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Controller('users')
export class UserController
{
    constructor(@Inject('KAFKA_SERVICE') private readonly kafkaclient: ClientKafka)
    {}

    private readonly logger = new Logger(UserController.name);
  
  
    @Post('create')
    async createUser(@Body() data: { id: string; name: string }) {
      this.logger.log(`Emitting user created event: ${JSON.stringify(data)}`);
      this.kafkaclient.emit('user.created', data);
      return { message: 'user created', data };
    }
}