import Realm from 'realm'
import { Category } from './category'
import { Task, TaskRepository } from './task'
import { ModelName } from '~/constants/db'
import { Day, Timestamp } from '~/@types'
import { ModelRepository, timestamp, timestampField } from '../utils'
import { uuid } from '~/utils/common'
import { assert } from '~/utils/assertion'
import { GoalToRead } from './goal-to-read'

export class Goal extends Realm.Object<Goal> {
  _id!: Realm.BSON.UUID
  category!: Realm.Results<Category>
  tasks!: Realm.List<Task>
  name!: string
  deadline!: Day
  active!: boolean
  createdAt: Timestamp = timestamp()
  updatedAt: Timestamp = timestamp()

  get id() {
    return this._id.toHexString()
  }

  static schema: Realm.ObjectSchema = {
    name: ModelName.Goal,
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      category: {
        type: 'linkingObjects',
        objectType: ModelName.Category,
        property: 'goals',
      },
      tasks: `${ModelName.Task}[]`,
      name: 'string',
      deadline: 'string',
      active: 'bool',
      createdAt: timestampField,
      updatedAt: timestampField,
    },
  }
}

export class GoalRepository extends ModelRepository {
  upsert(
    id: string | undefined,
    {
      category,
      ...params
    }: {
      name?: string
      category?: Category
      deadline?: string
      active?: boolean
    }
  ) {
    const _id = uuid(id)

    const existingObject = this.realm.objectForPrimaryKey(Goal, _id)
    const oldCategory = existingObject?.category[0]

    const newCategory = category ?? oldCategory
    assert(newCategory)

    const categoryChanged = oldCategory?.id !== newCategory.id

    if (oldCategory && categoryChanged) {
      oldCategory.goals = oldCategory.goals.filter(
        g => g.id !== existingObject.id
      )
    }

    const goal = this.realm.create(
      Goal,
      { _id, ...params, updatedAt: timestamp() },
      'modified'
    )

    if (categoryChanged || !oldCategory) {
      newCategory.goals.push(goal)
    }

    return goal
  }

  delete(goal: Goal) {
    goal.tasks.forEach(t => {
      new TaskRepository(this.realm).delete(t)
    })

    const goalsToRead = this.realm
      .objects(GoalToRead)
      .filtered('goalId = $0', goal._id)

    this.realm.delete(goalsToRead)

    this.realm.delete(goal)
  }
}
