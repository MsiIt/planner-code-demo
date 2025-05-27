import moment from 'moment'
import { DATE_FORMAT, TaskType } from '~/constants'
import { Task } from '~/db/models/task'
import { User } from '~/db/models/user'
import { assert } from '~/utils/assertion'
import { taskCountByDate } from './tasks'

export class TaskRescheduler {
  realm: Realm

  constructor(realm: Realm) {
    this.realm = realm
  }

  async process() {
    try {
      const user = this.realm.objects(User)[0]
      assert(user)
      const enabledAt = user.settings.transferUnfinishedTasksEnabledAt

      if (!enabledAt) {
        return
      }

      const tasks = this.realm
        .objects(Task)
        .filtered('active == true')
        .filtered('typeId == $0', TaskType.Custom)

      this.realm.write(() => {
        tasks.forEach(task => {
          const isOutdated = moment().isAfter(task.startDate, 'day')
          const isAfterEnabling = moment(task.startDate).isSameOrAfter(
            enabledAt,
            'day'
          )

          if (isOutdated && isAfterEnabling) {
            task.startDate = moment().format(DATE_FORMAT)
          }
        })
      })
      taskCountByDate.clear()
    } catch (error) {
      console.warn('-- task rescheduler: error')
      console.warn(error)
      throw error
    }
  }
}
