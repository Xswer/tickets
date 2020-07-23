import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@xstickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
