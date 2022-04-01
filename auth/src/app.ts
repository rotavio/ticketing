import express from "express";

// Override express behavior to allow throwing error inside async functions
// instead of having to call next()
import "express-async-errors";

import cookieSession from "cookie-session";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@rotavio-ticketing/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);
app.use(signinRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
