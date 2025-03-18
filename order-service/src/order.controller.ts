import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  @MessagePattern('user.created')
  handleUserCreated(@Payload() message: any) { // Use 'any' to handle different message structures
    try {
      // Check if 'value' exists in the message
      const messageValue = message.value ? message.value : message;
      const data = JSON.parse(messageValue);
      this.logger.log('User created event received:', data);
      return { message: 'Order processed for user', data };
    } catch (error) {
      this.logger.error('Failed to parse message:', error, message);
      throw error;
    }
  }
}