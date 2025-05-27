import Realm from 'realm'
import { Language } from '~/constants'
import { ModelName } from '~/constants/db'
import { timestamp, timestampField } from '../utils'
import { Day, Time, Timestamp } from '~/@types'

export class UserSettings extends Realm.Object<UserSettings> {
  language!: Language

  // tasks
  transferUnfinishedTasksEnabledAt!: null | Day
  sortTasksByPriority!: boolean

  // autotasks
  gratitudeAutotaskEnabledSince!: null | Day
  readAndCheckAutotaskEnabledSince!: null | Day
  dayAnalysisAutotaskEnabledSince!: null | Day
  achivementAutotaskEnabledSince!: null | Day

  // notifications
  morningNotificationEnabled!: boolean
  morningNotificationTime!: Time
  morningNotificationId!: null | string

  eveningNotificationEnabled!: boolean
  eveningNotificationTime!: Time
  eveningNotificationId!: null | string

  pushNotificationTypeId!: number

  // time
  is12hFormat!: boolean

  // minors
  creatorBannerHidden!: boolean
  categoryBannerHidden!: boolean
  goalBannerHidden!: boolean
  creatorMessageShown!: boolean
  subscriptionStoriesShown!: boolean

  booksLoaded!: boolean

  static schema: Realm.ObjectSchema = {
    name: 'UserSettings',
    properties: {
      language: 'string',
      transferUnfinishedTasksEnabledAt: 'string?',
      sortTasksByPriority: 'bool',

      gratitudeAutotaskEnabledSince: 'string?',
      readAndCheckAutotaskEnabledSince: 'string?',
      dayAnalysisAutotaskEnabledSince: 'string?',
      achivementAutotaskEnabledSince: 'string?',

      morningNotificationEnabled: 'bool',
      morningNotificationTime: 'string',
      morningNotificationId: 'string?',

      eveningNotificationEnabled: 'bool',
      eveningNotificationTime: 'string',
      eveningNotificationId: 'string?',

      pushNotificationTypeId: 'int',

      is12hFormat: 'bool',

      creatorBannerHidden: 'bool',
      categoryBannerHidden: 'bool',
      goalBannerHidden: 'bool',
      creatorMessageShown: 'bool',
      subscriptionStoriesShown: 'bool',

      booksLoaded: 'bool',
    },
  }
}

export class User extends Realm.Object<User> {
  _id!: Realm.BSON.UUID

  settings!: UserSettings

  createdAt: Timestamp = timestamp()
  updatedAt: Timestamp = timestamp()

  static schema: Realm.ObjectSchema = {
    name: ModelName.User,
    primaryKey: '_id',
    properties: {
      _id: 'uuid',

      settings: 'UserSettings',

      createdAt: timestampField,
      updatedAt: timestampField,
    },
  }
}
