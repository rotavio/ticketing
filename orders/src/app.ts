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
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
