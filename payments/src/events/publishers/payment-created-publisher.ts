import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@rotavio-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
