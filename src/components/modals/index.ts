import { EventEmitter } from '~/utils/event-emitter.ts'

type Event = 'ai-tasks-confirm'

export const modalEventEmitter = new EventEmitter<Event>()

export class Modals {
  static open(modal: Event, params: any) {
    modalEventEmitter.emit(modal, params)
  }
}
