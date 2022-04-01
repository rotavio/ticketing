import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@rotavio-ticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
