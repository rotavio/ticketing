import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@rotavio-ticketing/common";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
// Override express behavior to allow throwing error inside async functions
// instead of having to call next()
import "express-async-errors";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(createChargeRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
