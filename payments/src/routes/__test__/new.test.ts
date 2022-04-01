import { OrderStatus } from "@rotavio-ticketing/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("accepts post requests", async () => {
  const response = await request(app).post("/api/payments").send();
  expect(response.status).not.toEqual(404);
});

it("returns a 401 if user is not logged in", async () => {
  return request(app)
    .post("/api/payments")
    .send({ token: "", orderId: "password" })
    .expect(401);
});

it("returns a 400 with invalid inputs", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ token: "", orderId: "password" })
    .expect(400);

  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ token: "123", orderId: "" })
    .expect(400);
});

it("returns a 404 if order does not exist", async () => {
  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "fdfdfdfdf",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when user was not the one who created the order", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 30,
  });
  await order.save();

  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ token: "123", orderId: order.id })
    .expect(401);
});

it("returns a 400 when paying for a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    userId,
    price: 30,
  });
  await order.save();

  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ token: "123", orderId: order.id })
    .expect(400);
});

// Test using the real Stripe api in video 463
it("creates a payment with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId,
    price: 30,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ token: "tok_visa", orderId: order.id })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(30 * 100);
  expect(chargeOptions.currency).toEqual("usd");

  const payment = await Payment.findOne({ orderId: order.id });
  expect(payment).not.toBeNull();
});
