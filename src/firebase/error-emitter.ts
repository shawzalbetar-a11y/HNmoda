import { EventEmitter } from 'events';

// It's a good practice to type your events
interface ErrorEvents {
  'permission-error': (error: Error) => void;
}

declare interface ErrorEmitter {
  on<U extends keyof ErrorEvents>(event: U, listener: ErrorEvents[U]): this;
  emit<U extends keyof ErrorEvents>(event: U, ...args: Parameters<ErrorEvents[U]>): boolean;
}

class ErrorEmitter extends EventEmitter {}

export const errorEmitter = new ErrorEmitter();
