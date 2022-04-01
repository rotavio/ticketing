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
import { indexTicketRouter } from "./routes";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { updateTicketRouter } from "./routes/update";

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

app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);
app.use(indexTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
