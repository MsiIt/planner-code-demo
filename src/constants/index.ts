export enum AppStatus {
  IDLE,
  STARTING,
  UP,
}

export enum UserStatus {
  UNINITIALIZED,
  INITIALIZED,
}

export enum Language {
  EN = 'en',
  RU = 'ru',
  UK = 'uk',
}

export const DATE_FORMAT = 'YYYY-MM-DD'
export const TIME_FORMAT = 'HH:mm:ss'

export const TASK_LIMIT = 5

export enum TaskType {
  Custom = 0,

  Gratitude = 1,
  GoalReading = 2,
  DayAnalysis = 3,
  Achievement = 4,
}

export enum Priority {
  Main = 1,

  A = 2,
  B = 3,
  C = 4,
  D = 5,

  NotSpecified = 6,
}

export enum RepeatOption {
  Day = 'daily',
  Month = 'monthly',
  Year = 'annual',
}
