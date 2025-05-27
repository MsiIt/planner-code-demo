import Realm from 'realm'
import { ModelName } from '~/constants/db'
import { Task } from './task'
import { ModelRepository } from '../utils'
import { uuid } from '~/utils/common'

export class TaskNotification extends Realm.Object<TaskNotification> {
  _id!: Realm.BSON.UUID
  taskId!: Realm.BSON.UUID
  notificationId!: string

  get id() {
    return this._id.toHexString()
  }

  static schema: Realm.ObjectSchema = {
    name: ModelName.TaskNotification,
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      taskId: 'uuid',
      notificationId: 'string',
    },
  }
}

export class TaskNotificationRepository extends ModelRepository {
  insert({ task, notificationId }: { task: Task; notificationId: string }) {
    this.realm.create(TaskNotification, {
      _id: uuid(),
      taskId: task._id,
      notificationId,
    })
  }
}
