import Realm from 'realm'
import { Day, Timestamp, Time } from '~/@types'
import { Priority, TaskType } from '~/constants'
import { ModelName } from '~/constants/db'
import { Goal } from './goal'
import { ModelRepository, timestamp, timestampField } from '../utils'
import { uuid } from '~/utils/common'

export class Task extends Realm.Object<Task> {
  _id!: Realm.BSON.UUID
  goal!: Realm.Results<Goal>
  name!: string
  text!: string
  active!: boolean
  startDate?: Day
  endDate?: Day // unused
  startTime?: Time // если не заданно, значит целый день
  endTime?: Time
  typeId!: TaskType
  priorityId!: Priority
  notificationTime?: Time
  notificationDate?: Day
  repeatOptions?: RepeatOptions
  parentId?: string
  hidden?: boolean
  createdAt: Timestamp = timestamp()
  updatedAt: Timestamp = timestamp()

  get id() {
    return this._id.toHexString()
  }

  static schema: Realm.ObjectSchema = {
    name: ModelName.Task,
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      goal: {
        type: 'linkingObjects',
        objectType: ModelName.Goal,
        property: 'tasks',
      },
      name: 'string?',
      text: 'string?',
      active: 'bool',
      startDate: 'string?',
      endDate: 'string?',
      startTime: 'string?',
      endTime: 'string?',
      typeId: 'int',
      priorityId: 'int',
      notificationTime: 'string?',
      notificationDate: 'string?',
      repeatOptions: 'RepeatOptions?',
      parentId: 'string?',
      hidden: 'bool?',
      createdAt: timestampField,
      updatedAt: timestampField,
    },
  }
}

export class TaskRepository extends ModelRepository {
  /**
   * goal must be provided on update
   */
  upsert(
    id: undefined | string,
    {
      goal,
      ...params
    }: {
      goal?: Goal
      name?: string
      text?: string
      active?: boolean
      startDate?: Day
      endDate?: Day
      startTime?: Time
      endTime?: Time
      typeId?: TaskType
      priorityId?: Priority
      notificationTime?: Time
      notificationDate?: Day
      repeatOptions?: RepeatOptions
      parentId?: string
      hidden?: boolean
    }
  ) {
    const _id = uuid(id)
    const existingObject = this.realm.objectForPrimaryKey(Task, _id)

    const oldGoal = existingObject?.goal?.[0]
    const newGoal = goal

    const goalChanged = oldGoal?.id !== newGoal?.id

    if (oldGoal && goalChanged) {
      oldGoal.tasks = oldGoal.tasks.filter(t => t.id !== existingObject.id)
    }

    const task = this.realm.create(
      Task,
      { _id, ...params, updatedAt: timestamp() },
      'modified'
    )

    if (goalChanged && newGoal) {
      newGoal.tasks.push(task)
    }

    return task as Task
  }

  delete(task: Task) {
    this.realm.delete(task)
  }
}

export class RepeatOptions extends Realm.Object<RepeatOptions> {
  type!: string
  daysOfWeek?: boolean[]
  daysOfMonth?: number[]
  isLastDayOfMonth?: boolean
  dateOfYear?: string

  static schema: Realm.ObjectSchema = {
    name: 'RepeatOptions',
    properties: {
      type: 'string',
      daysOfWeek: 'bool[]',
      daysOfMonth: 'int[]',
      isLastDayOfMonth: 'bool?',
      dateOfYear: 'string?',
    },
  }
}
