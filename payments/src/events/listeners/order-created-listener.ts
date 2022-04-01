import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@rotavio-ticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "../listeners/queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, status, version, userId } = data;

    const order = Order.build({
      id,
      status,
      version,
      userId,
      price: data.ticket.price,
    });
    await order.save();

    msg.ack();
  }
}
