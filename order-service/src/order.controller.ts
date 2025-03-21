import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  // order.controller.ts (Order-service)
  @MessagePattern('user.created')
  handleUserCreated(@Payload() data: any) {
    this.logger.log(`User created event received: ${JSON.stringify(data)}`);
    return { message: 'order processed for user', data };
  }
}