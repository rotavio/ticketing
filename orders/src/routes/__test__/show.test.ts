import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/orders/:orderId for get requests", async () => {
  const response = await request(app).get("/api/orders/gfdgdfg").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  // const id = new mongoose.Types.ObjectId().toHexString();
  const id = "dfdfdfdfdfdf";

  await request(app).get(`/api/orders/${id}`).send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .get(`/api/orders/${id}`)
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

// const buildTicket = async () => {
//   const ticket = Ticket.build({ title: "Ticket Title", price: 40 });
//   await ticket.save();
//   return ticket;
// };

it("returns 401 if the user does not owns the order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Ticket Title",
    price: 40,
  });
  await ticket.save();

  // make a request to build an order for this ticket
  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});

it("fetches the order", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Ticket Title",
    price: 40,
  });
  await ticket.save();

  // make a request to build an order for this ticket
  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
