import { action, makeObservable, observable } from 'mobx'
import moment from 'moment'
import { EventEmitter } from '~/utils/event-emitter'

class NavigationStore {
  categoryFormRef = null
  taskFormRef = null
  goalFormRef = null

  categoryId?: string = undefined
  categoryRef = null

  aiTaskRef = null

  // utils

  eventEmitter = new EventEmitter<
    'show-onboarding-timer' | 'hide-onboarding-timer'
  >()

  taskScreenDate = moment()

  constructor() {
    makeObservable(this, {
      taskFormRef: observable,
      setTaskFormRef: action,

      categoryId: observable,
      setCategoryId: action,
      categoryRef: observable,
      setCategoryRef: action,
      categoryFormRef: observable,
      setCategoryFormRef: action,

      aiTaskRef: observable,
      setAiTaskRef: action,

      goalFormRef: observable,
      setGoalFormRef: action,
    })
  }

  setCategoryId(categoryId: string) {
    this.categoryId = categoryId
  }
  setCategoryRef(ref) {
    this.categoryRef = ref
  }

  setCategoryFormRef(ref) {
    this.categoryFormRef = ref
  }
  setGoalFormRef(ref) {
    this.goalFormRef = ref
  }
  setTaskFormRef(ref) {
    this.taskFormRef = ref
  }
  setAiTaskRef(ref) {
    this.aiTaskRef = ref
  }
}

export const navigationStore = new NavigationStore()
