import { TicketUpdatedEvent } from "@rotavio-ticketing/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Ticket title",
    price: 20,
  });
  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "New title",
    price: 30,
    userId: "ldkfjll",
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { ticket, listener, data, msg };
};

it("finds, updates and save a ticket", async () => {
  const { ticket, listener, data, msg } = await setup();

  // call the onMessage funcion with the data
  // and message objects
  await listener.onMessage(data, msg);

  // assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
  expect(updatedTicket!.version).toEqual(ticket.version + 1);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage funcion with the data
  // and message objects
  await listener.onMessage(data, msg);

  // assertions to make sure ack function was called
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack with an unordered version number", async () => {
  const { listener, data, msg } = await setup();
  data.version++;

  // call the onMessage funcion with the data
  // and message objects
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  // assertions to make sure ack function was called
  expect(msg.ack).not.toHaveBeenCalled();
});
