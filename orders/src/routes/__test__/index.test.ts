import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/orders for get requests", async () => {
  const response = await request(app).get("/api/orders").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).get("/api/orders").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Ticket Title",
    price: 40,
  });
  await ticket.save();
  return ticket;
};

it("fetches order for a particular user", async () => {
  // Create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = global.signin();
  const user2 = global.signin();

  // Create one order as User #1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // Create two orders as User #2
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[0].ticket.id).toEqual(ticket2.id);
  expect(response.body[1].ticket.id).toEqual(ticket3.id);
});
