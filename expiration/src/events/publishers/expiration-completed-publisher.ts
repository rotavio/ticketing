import {
  ExpirationCompletedEvent,
  Publisher,
  Subjects,
} from "@rotavio-ticketing/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
}
