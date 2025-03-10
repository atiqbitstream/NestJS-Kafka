import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()

export class OrderController
{
    @MessagePattern('user.created')
    handleUserCreated(@Payload() data: {id:string; name:string})
    {
        console.log('User created event received: ',data);
        return {message: 'order processed for user',data};
    }
}