import Realm from 'realm'
import { Goal, GoalRepository } from './goal'
import { ModelName } from '~/constants/db'
import { ModelRepository, timestamp, timestampField } from '../utils'
import { Timestamp } from '~/@types'
import { uuid } from '~/utils/common'

export class Category extends Realm.Object<Category> {
  _id!: Realm.BSON.UUID
  goals!: Realm.List<Goal>
  name!: string
  createdAt: Timestamp = timestamp()
  updatedAt: Timestamp = timestamp()

  get id() {
    return this._id.toHexString()
  }

  static schema: Realm.ObjectSchema = {
    name: ModelName.Category,
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      goals: `${ModelName.Goal}[]`,
      name: 'string',
      createdAt: timestampField,
      updatedAt: timestampField,
    },
  }
}

export class CategoryRepository extends ModelRepository {
  upsert(id: string | undefined, params: { name: string }) {
    const _id = uuid(id)
    return this.realm.create(
      Category,
      { _id, ...params, updatedAt: timestamp() },
      'modified'
    )
  }

  delete(category: Category) {
    category.goals.forEach(g => {
      new GoalRepository(this.realm).delete(g)
    })

    this.realm.delete(category)
  }
}
