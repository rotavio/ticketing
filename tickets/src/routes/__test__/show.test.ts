import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if it is found", async () => {
  const title = "Ticket title";
  const price = 333;

  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  const response = await request(app)
    .get(`/api/tickets/${createResponse.body.id}`)
    .send()
    .expect(200);

  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});
