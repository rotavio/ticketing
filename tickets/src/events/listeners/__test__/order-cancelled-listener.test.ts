import { OrderCancelledEvent } from "@rotavio-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // Create as instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "Ticket title",
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  ticket.orderId = new mongoose.Types.ObjectId().toHexString();
  await ticket.save();

  // Create a fake data object
  const data: OrderCancelledEvent["data"] = {
    id: ticket.orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create a fake msg object
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, ticket, data, msg };
};

it("unsets the orderId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeUndefined();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket update event", async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // Example of accessing mock function params
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(ticketUpdatedData.orderId).toBeUndefined();
});
