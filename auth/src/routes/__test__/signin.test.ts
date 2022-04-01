import request from "supertest";
import { app } from "../../app";

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "invalid", password: "password" })
    .expect(400);
});

it("returns a 400 with missing email and/or password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com" })
    .expect(400);

  return request(app)
    .post("/api/users/signin")
    .send({ password: "password" })
    .expect(400);
});

it("fails with an unregistered email", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
});

it("fails with an invalid password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  return request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "123456" })
    .expect(400);
});

it("sets a cookie after successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com", password: "password" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
