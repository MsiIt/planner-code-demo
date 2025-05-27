import moment from 'moment'
import { call } from 'redux-saga/effects'
import { openRealm } from '~/db'
import {
  TaskNotification,
  TaskNotificationRepository,
} from '~/db/models/task-notification'
import { Task } from '~/db/models/task'
import { NotificationService } from '~/services/notifications'
import { dayTimeToDate } from '~/utils/date'
import { t } from 'i18next'

export function* realmWatcher() {
  const realm = (yield call(openRealm)) as Awaited<ReturnType<typeof openRealm>>

  const scheduleTask = async (task: Task) => {
    if (task.notificationTime && task.active) {
      const date = dayTimeToDate(task.notificationDate, task.notificationTime)

      // if (moment(date).isSameOrBefore()) {
      //   return
      // }
      const formatedStartTime = task.startTime
        ? moment(task.startTime, 'HH:mm:ss').format('HH:mm')
        : ''
      const formatedEndTime = task.endTime
        ? moment(task.endTime, 'HH:mm:ss').format('HH:mm')
        : ''
      const notificationText = task.startTime
        ? `[${formatedStartTime}${
            task.endTime ? ` - ${formatedEndTime}` : ''
          }][${task.name}]`
        : `[${task.name}]`

      const id = await NotificationService.schedule({
        title: t('notifications.task.title'),
        text: notificationText,
        timestamp: date.getTime(),
      })

      realm.write(() => {
        new TaskNotificationRepository(realm).insert({
          task,
          notificationId: id,
        })
      })
    }
  }

  const removeNotifications = async (
    notifications: Realm.Results<
      TaskNotification & Realm.Object<unknown, never>
    >
  ) => {
    await Promise.all(
      notifications.map(n =>
        NotificationService.cancelNotiication(n.notificationId)
      )
    )

    realm.write(() => {
      notifications.forEach(n => {
        realm.delete(n)
      })
    })
  }
  const unscheduleTask = async (task: Task) => {
    if (task._id) {
      const notifications = realm
        .objects(TaskNotification)
        .filtered('taskId == $0', task._id)

      await removeNotifications(notifications)
    }
  }

  const tasksQuery = realm.objects(Task)
  tasksQuery.addListener((tasks, changes) => {
    changes.newModifications.forEach(async i => {
      const task = tasks[i]
      await unscheduleTask(task)
      await scheduleTask(task)
    })
    changes.insertions.forEach(async i => {
      const task = tasks[i]
      await scheduleTask(task)
    })
    changes.deletions.forEach(async i => {
      const tasksWithNotifications = realm
        .objects(Task)
        .filtered('notificationTime != $0', null)
      const notifications = realm.objects(TaskNotification).filtered(
        'taskId IN NONE $0',
        tasksWithNotifications.map(t => t._id)
      )

      await removeNotifications(notifications)
    })
  })
}
