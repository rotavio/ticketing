import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@rotavio-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
