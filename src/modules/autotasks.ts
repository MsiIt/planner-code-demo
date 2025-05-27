import moment from 'moment'
import { Day } from '~/@types'
import { DATE_FORMAT, Priority, TaskType } from '~/constants'
import { Goal } from '~/db/models/goal'
import { GoalToRead } from '~/db/models/goal-to-read'
import { Task, TaskRepository } from '~/db/models/task'
import { User } from '~/db/models/user'
import { assert } from '~/utils/assertion'
import { uuid } from '~/utils/common'

export class AutotasksModule {
  realm: Realm
  taskRepository: TaskRepository

  constructor(realm: Realm) {
    this.realm = realm
    this.taskRepository = new TaskRepository(this.realm)
  }

  async process() {
    this.realm.write(() => {
      console.log('-- autotask module: start')

      try {
        const user = this.realm.objects(User)[0]
        assert(user)
        const today = moment().format(DATE_FORMAT)
        const tasks = this.realm
          .objects(Task)
          .filtered('startDate == $0', today)
          .filtered('typeId != $0', TaskType.Custom)

        const isValidDate = (date: null | Day) => {
          if (!date) {
            return false
          }

          return moment().isSameOrAfter(date, 'day')
        }

        const activeGoals = this.realm.objects(Goal).filtered('active == true')
        if (
          activeGoals.length > 0 &&
          isValidDate(user.settings.readAndCheckAutotaskEnabledSince) &&
          !tasks.find(t => t.typeId === TaskType.GoalReading)
        ) {
          const task = this.taskRepository.upsert(undefined, {
            active: true,
            startDate: today,
            typeId: TaskType.GoalReading,
            priorityId: Priority.NotSpecified,
          })

          activeGoals.forEach(g => {
            this.realm.create(GoalToRead, {
              _id: uuid(),
              taskId: task._id,
              goalId: g._id,
              isRead: false,
            })
          })
        }

        if (
          isValidDate(user.settings.gratitudeAutotaskEnabledSince) &&
          !tasks.find(t => t.typeId === TaskType.Gratitude)
        ) {
          this.taskRepository.upsert(undefined, {
            active: true,
            startDate: today,
            typeId: TaskType.Gratitude,
            text: '',
            priorityId: Priority.NotSpecified,
          })
        }

        if (
          isValidDate(user.settings.dayAnalysisAutotaskEnabledSince) &&
          !tasks.find(t => t.typeId === TaskType.DayAnalysis)
        ) {
          this.taskRepository.upsert(undefined, {
            active: true,
            startDate: today,
            typeId: TaskType.DayAnalysis,
            text: '',
            priorityId: Priority.NotSpecified,
          })
        }

        if (
          isValidDate(user.settings.achivementAutotaskEnabledSince) &&
          !tasks.find(t => t.typeId === TaskType.Achievement)
        ) {
          this.taskRepository.upsert(undefined, {
            active: true,
            startDate: today,
            typeId: TaskType.Achievement,
            text: '',
            priorityId: Priority.NotSpecified,
          })
        }
        console.log('-- autotask module: finish')
      } catch (error) {
        console.warn('-- autotask module: error')
        console.warn(error)
        throw error
      }
    })
  }
}
