import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@rotavio-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
