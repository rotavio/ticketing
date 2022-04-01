import request from "supertest";
import { app } from "../../app";

it("returns the user object when signed in", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("returns null when not signed in", async () => {
  const response = await request(app)
    .get("/api/users/currentUser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeNull();
});
