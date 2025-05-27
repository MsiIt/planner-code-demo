import Realm from 'realm'
import { ModelName } from '~/constants/db'

export class GoalToRead extends Realm.Object<GoalToRead> {
  _id!: Realm.BSON.UUID
  taskId!: Realm.BSON.UUID
  goalId!: Realm.BSON.UUID
  isRead!: boolean

  get id() {
    return this._id.toHexString()
  }

  static schema: Realm.ObjectSchema = {
    name: ModelName.GoalToRead,
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      taskId: 'uuid',
      goalId: 'uuid',
      isRead: 'bool',
    },
  }
}
