import Realm from 'realm'
import { createRealmContext } from '@realm/react'
import { RepeatOptions, Task } from './models/task'
import { Category } from './models/category'
import { Goal } from './models/goal'
import { User, UserSettings } from './models/user'
import { TaskNotification } from './models/task-notification'
import { Book, BookLocalData } from './models/book'
import { GoalToRead } from './models/goal-to-read'
import { ModelName } from '~/constants/db'

// Create a configuration object
const realmConfig: Realm.Configuration = {
  schema: [
    Category,
    Goal,
    Task,
    GoalToRead,
    User,
    TaskNotification,
    Book,
    RepeatOptions,
    UserSettings,
    BookLocalData,
  ],
  schemaVersion: 16,
  onMigration: (oldRealm, newRealm) => {

  },
}

// Create a realm context
export const { RealmProvider, useRealm, useObject, useQuery } =
  createRealmContext(realmConfig)

export const openRealm = async () => await Realm.open(realmConfig)
