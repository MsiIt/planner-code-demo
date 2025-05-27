type EventCallback = (...args: any[]) => void

export class EventEmitter<event extends string = any> {
  private events: { [key in event]: EventCallback[] }

  constructor() {
    this.events = {}
  }

  public on(eventName: event, callback: EventCallback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }

    this.events[eventName].push(callback)

    return () => {
      this.off(eventName, callback)
    }
  }

  public off(eventName: event, callback: EventCallback): void {
    if (!this.events[eventName]) {
      return
    }

    const index = this.events[eventName].indexOf(callback)
    if (index !== -1) {
      this.events[eventName].splice(index, 1)
    }
  }

  public emit(eventName: event, ...args: any[]): void {
    const eventCallbacks = this.events[eventName]
    if (!eventCallbacks) {
      return
    }

    eventCallbacks.forEach(callback => {
      callback.apply(null, args)
    })
  }
  public altEmit(eventName: event, ...args: any[]) {
    const eventCallbacks = this.events[eventName]
    if (!eventCallbacks) {
      return
    }

    return eventCallbacks.map(callback => callback(...args))
  }
}
