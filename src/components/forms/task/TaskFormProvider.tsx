import React, { useEffect, useState } from 'react'
import { taskFromContext } from './task-form-context'
import { Goal } from '~/db/models/goal'
import { Day, Time } from '~/@types'
import { DATE_FORMAT, Priority, RepeatOption, TaskType } from '~/constants'
import { useObject, useRealm } from '~/db'
import { Task, TaskRepository } from '~/db/models/task'
import { uuid } from '~/utils/common'
import { useTranslation } from 'react-i18next'
import { useFormValue } from '~/utils/hooks/use-form-value'
import { navigationStore } from '~/navigation/navigation-store'
import { useMoment } from '~/modules/hooks/use-moment'
import { taskCountByDate } from '~/modules/tasks'
import { Toast } from '~/modules/toast'
import analytics from '@react-native-firebase/analytics'

const TaskFormProvider = ({ params, children, onCloseRequest }) => {
  const realm = useRealm()
  const { t } = useTranslation()
  const moment = useMoment()
  const taskId = params?.taskId
  const isPlan = params?.isPlan
  const task = useObject(Task, uuid(taskId))

  const [name, setName, nameError] = useFormValue(task?.name ?? '', v => {
    if (!v.length) {
      return t('required-field')
    }
  })
  const [goal, setGoal] = useState<Goal | undefined>(task?.goal?.[0])
  const [active, setActive] = useState(task?.active ?? true)
  const [date, setDate, dateError] = useFormValue<Day | undefined>(
    !isPlan
      ? task?.startDate ?? navigationStore.taskScreenDate.format(DATE_FORMAT)
      : moment().format(DATE_FORMAT),
    v => {
      if (!v) {
        return t('required-field')
      }
    }
  )
  const [isAllDay, setIsAllDay] = useState<boolean>(
    !task?.startTime && !task?.endTime
  )

  const [startTime, setStartTime] = useState<Time | undefined | null>(
    task?.startTime
  )
  const [endTime, setEndTime] = useState<Time | undefined | null>(task?.endTime)

  const [priority, setPriority] = useState<Priority>(
    task?.priorityId ?? Priority.NotSpecified
  )

  const [notificationDate, setNotificationDate] = useState<Day | undefined>(
    task?.notificationDate
  )

  const [notificationTime, setNotificationTime] = useState<Time | undefined>(
    task?.notificationTime
  )

  const [showErrors, setShowErrors] = useState(false)

  useEffect(() => {
    if (isAllDay) {
      setStartTime(null)
      setEndTime(null)
    }
  }, [isAllDay])

  const handleStartTimeSet = time => {
    setStartTime(time)
  }
  const handleEndTimeSet = time => {
    setEndTime(time)
  }

  const enableNotification = () => {
    setNotificationTime('12:00:00')
    setNotificationDate(navigationStore.taskScreenDate.format(DATE_FORMAT))
  }
  const disableNotification = () => {
    setNotificationTime(null)
    setNotificationDate(null)
  }

  const [repeatType, setRepeatType] = useState(
    task?.repeatOptions?.type ?? RepeatOption.Day
  )
  const [days, setDays] = useState(
    task?.repeatOptions?.daysOfWeek ?? new Array(7).fill(false)
  )
  const [daysOfMonth, setDaysOfMonth] = useState(
    task?.repeatOptions?.daysOfMonth ?? []
  )
  const [isLastDayOfMonth, setIsLastDayOfMonth] = useState(
    task?.repeatOptions?.isLastDayOfMonth ?? false
  )
  const [dateOfYear, setDateOfYear] = useState(
    task?.repeatOptions?.dateOfYear ??
      task?.startDate ??
      navigationStore.taskScreenDate.format(DATE_FORMAT)
  )
  const [repeatOptions, setRepeatOptions] = useState(
    task?.repeatOptions ?? null
  )

  useEffect(() => {
    if (repeatType === RepeatOption.Day) {
      setDaysOfMonth([])
      setIsLastDayOfMonth(false)
      setDateOfYear(navigationStore.taskScreenDate.format(DATE_FORMAT))
    } else if (repeatType === RepeatOption.Month) {
      setDays(new Array(7).fill(false))
      setDateOfYear(navigationStore.taskScreenDate.format(DATE_FORMAT))
    } else if (repeatType === RepeatOption.Year) {
      setDays(new Array(7).fill(false))
      setDaysOfMonth([])
      setIsLastDayOfMonth(false)
    }
  }, [repeatType])

  const [stopRepeatDate, setStopRepeatDate] = useState(task?.endDate ?? null)

  const [currentDay, setCurrentDay] = useState(params?.day)
  const [minimumDate, setMinimumDate] = useState(params?.day)

  const submit = () => {
    if (nameError || dateError) {
      setShowErrors(true)
      return
    }

    try {
      if (repeatOptions) {
        if (!isPlan) {
          if (date === currentDay || !taskId) {
            analytics().logEvent('add_task', {
              eisenhower_quad: priority,
              repeat_rule: repeatType,
            })
            const now = moment().startOf('day')
            const newDate = moment(date).startOf('day')
            const diffInDays = newDate.diff(now, 'days')
            const newDateAfterNow = newDate.isSameOrAfter(now, 'days')

            analytics().logEvent('schedule_task', {
              days_ahead: newDateAfterNow ? diffInDays : 0,
            })
            realm.write(() => {
              new TaskRepository(realm).upsert(taskId, {
                goal,
                name: name.trim(),
                active,
                startDate: date,
                startTime,
                endTime,
                typeId: TaskType.Custom,
                priorityId: priority,
                notificationTime,
                notificationDate,
                repeatOptions,
                endDate: stopRepeatDate,
              })
            })
            onCloseRequest?.()
          } else {
            realm.write(() => {
              new TaskRepository(realm).upsert(undefined, {
                goal,
                name: name.trim(),
                active,
                startDate: currentDay,
                startTime,
                endTime,
                typeId: TaskType.Custom,
                priorityId: priority,
                notificationTime,
                notificationDate,
                repeatOptions,
                endDate: stopRepeatDate,
                parentId: taskId,
              })
            })

            realm.write(() => {
              new TaskRepository(realm).upsert(taskId, {
                goal: task?.goal?.[0],
                name: task?.name,
                active,
                startDate: date,
                startTime: task?.startTime,
                endTime: task?.endTime,
                typeId: TaskType.Custom,
                priorityId: task?.priorityId,
                notificationTime: task?.notificationTime,
                notificationDate: task?.notificationDate,
                repeatOptions: task?.repeatOptions,
                endDate: navigationStore.taskScreenDate
                  .subtract(1, 'days')
                  .format(DATE_FORMAT),
              })
            })
            onCloseRequest?.()
          }
        } else {
          const now = moment().startOf('day')
          const newDate = moment(date).startOf('day')
          const diffInDays = newDate.diff(now, 'days')
          const newDateAfterNow = newDate.isSameOrAfter(now, 'days')

          analytics().logEvent('schedule_task', {
            days_ahead: newDateAfterNow ? diffInDays : 0,
          })

          realm.write(() => {
            new TaskRepository(realm).upsert(taskId, {
              goal,
              name: task?.name,
              active,
              startDate: date,
              startTime,
              endTime,
              typeId: TaskType.Custom,
              priorityId: priority,
              notificationTime,
              notificationDate,
              repeatOptions,
              endDate: stopRepeatDate,
            })
          })
          onCloseRequest?.()
        }
      } else {
        if (!taskId) {
          analytics().logEvent('add_task', {
            eisenhower_quad: priority,
            repeat_rule: 'none',
          })
          const now = moment().startOf('day')
          const newDate = moment(date).startOf('day')
          const diffInDays = newDate.diff(now, 'days')
          const newDateAfterNow = newDate.isSameOrAfter(now, 'days')

          analytics().logEvent('schedule_task', {
            days_ahead: newDateAfterNow ? diffInDays : 0,
          })
          realm.write(() => {
            new TaskRepository(realm).upsert(taskId, {
              goal,
              name: name.trim(),
              active,
              startDate: date,
              startTime,
              endTime,
              typeId: TaskType.Custom,
              priorityId: priority,
              notificationTime,
              notificationDate,
              repeatOptions,
              endDate: stopRepeatDate,
            })
          })
          onCloseRequest?.()
        } else {
          realm.write(() => {
            new TaskRepository(realm).upsert(taskId, {
              goal,
              name: name.trim(),
              active,
              startDate: date,
              startTime,
              endTime,
              typeId: TaskType.Custom,
              priorityId: priority,
              notificationTime,
              notificationDate,
              repeatOptions,
              endDate: stopRepeatDate,
            })
          })
          onCloseRequest?.()
        }
      }
      taskCountByDate.clear()
    } catch (error) {
      if (error.message.includes('No space left on device')) {
        Toast.show({
          type: 'info',
          text1: t('warning.no-space-left'),
        })
      } else {
        console.error('Error writing data:', error)
      }
    }
  }
  const cancel = () => {
    onCloseRequest?.()
  }

  const contextValue = {
    isEdit: !!task,

    name,
    nameError,
    setName,
    goal,
    setGoal,
    date,
    dateError,
    setDate,

    isAllDay,
    setIsAllDay,
    startTime,
    handleStartTimeSet,
    endTime,
    handleEndTimeSet,

    priority,
    setPriority,

    enableNotification,
    disableNotification,

    notificationDate,
    setNotificationDate,
    notificationTime,
    setNotificationTime,

    repeatType,
    setRepeatType,
    days,
    setDays,
    daysOfMonth,
    setDaysOfMonth,
    isLastDayOfMonth,
    setIsLastDayOfMonth,
    dateOfYear,
    setDateOfYear,

    repeatOptions,
    setRepeatOptions,

    stopRepeatDate,
    setStopRepeatDate,

    currentDay,
    setCurrentDay,
    minimumDate,
    taskId,
    isPlan,

    showErrors,

    submit,
    cancel,
  }

  return (
    <taskFromContext.Provider value={contextValue}>
      {children}
    </taskFromContext.Provider>
  )
}

export default TaskFormProvider
