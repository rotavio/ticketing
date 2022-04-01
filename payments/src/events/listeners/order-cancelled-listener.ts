import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@rotavio-ticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(
    data: { id: string; version: number; ticket: { id: string } },
    msg: Message
  ) {
    // Version not really necessary - no events between Created and Cancelled
    // Only future-proofing, just in case
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
