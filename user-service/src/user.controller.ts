import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

@Controller('users')
export class UserController
{
    constructor(@Inject('KAFKA_SERVICE') private readonly kafkaclient: ClientKafka)
    {}

    @Post('create')
    async createUser(@Body() data: {id:string; name:string})
    {
        this.kafkaclient.emit('user.created',data);
        return {message: 'user created',data};
    }
}