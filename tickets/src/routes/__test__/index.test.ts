import request from "supertest";
import { app } from "../../app";

const createTicket = (title = "Ticket name", price = 25) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price });
};

it("can fetch a list of tickets", async () => {
  await createTicket("Ticket A", 20);
  await createTicket("Ticket B", 30);
  await createTicket("Ticket C", 40);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
