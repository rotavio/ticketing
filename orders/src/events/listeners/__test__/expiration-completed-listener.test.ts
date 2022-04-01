import {
  ExpirationCompletedEvent,
  OrderStatus,
  TicketUpdatedEvent,
} from "@rotavio-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompletedListener } from "../expiration-completed-listener";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Ticket title",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    userId: "sdfsdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // create a fake data event
  const data: ExpirationCompletedEvent["data"] = {
    orderId: order.id,
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { order, listener, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { order, listener, data, msg } = await setup();

  // call the onMessage funcion with the data
  // and message objects
  await listener.onMessage(data, msg);

  // assertions to make sure a ticket was created
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelled event", async () => {
  const { order, listener, data, msg } = await setup();

  // call the onMessage funcion with the data
  // and message objects
  await listener.onMessage(data, msg);

  // assertions to make sure client publish function was called
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { order, listener, data, msg } = await setup();

  // call the onMessage funcion with the data
  // and message objects
  await listener.onMessage(data, msg);

  // assertions to make sure ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
