import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()

export class OrderController
{
    @MessagePattern('user.created')
  handleUserCreated(@Payload() message: { value: string }) {
    const data = JSON.parse(message.value); // Parse the JSON string
    console.log('User created event received:', data);
    return { message: 'order processed for user', data };
}

}