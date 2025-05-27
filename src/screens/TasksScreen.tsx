import { useAppState } from '@react-native-community/hooks'
import React, { createContext, memo, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, View } from 'react-native'
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated'
import { ScreenComponent } from '~/@types/utils'
import GoalReadingTaskItem from '~/components/screens/tasks-screen/task-items/GoalReadingTaskItem'
import InputTaskItem from '~/components/screens/tasks-screen/task-items/InputTaskItem'
import TaskItem from '~/components/screens/tasks-screen/task-items/TaskItem'
import PromotionOverlay from '~/components/subscription-service/PromotionOverlay'
import Text from '~/components/ui/text/Text'
import KeyboardAvoidingScrollView from '~/components/ui/views/KeyboardAvoidingScrollView'
import { DATE_FORMAT, RepeatOption, TaskType } from '~/constants'
import { useQuery, useRealm } from '~/db'
import { Task } from '~/db/models/task'
import { AutotasksModule } from '~/modules/autotasks'
import { useMoment } from '~/modules/hooks/use-moment'
import { useSettings } from '~/modules/hooks/use-settings'
import { TaskRescheduler } from '~/modules/task-rescheduler'
import { navigationStore } from '~/navigation/navigation-store'
import { useSelector } from '~/store/utils'
import { W_H_PADDING } from '~/styles'
import { Color } from '~/styles/color'
import TasksHeader from '~/components/screens/tasks-screen/TasksHeader.tsx'
import { useDispatch } from 'react-redux'
import { setTasksDate } from '~/store/app/actions.ts'

export const HiddenTasksContext = createContext({})
export const TasksSettingsContext = createContext({})

const TasksScreen: ScreenComponent = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const isSubscribed = useSelector(s => s.iap.isSubscribed)
  const moment = useMoment()
  const date = useSelector(s => s.app.date)
  const settings = useSettings()
  const calendarRef = useRef()
  const appState = useAppState()
  const lastTodayDateRef = useRef(moment().format(DATE_FORMAT))

  useEffect(() => {
    if (
      appState === 'active' &&
      lastTodayDateRef.current !== moment().format(DATE_FORMAT)
    ) {
      calendarRef.current?.scrollToStart?.()
    }

    lastTodayDateRef.current = moment().format(DATE_FORMAT)
  }, [moment, appState])

  useEffect(() => {
    navigationStore.taskScreenDate = moment(date)
  }, [date])

  const dateMoment = moment(date)
  const day = dateMoment.format(DATE_FORMAT)
  const currentWeekday = (dateMoment.day() + 6) % 7
  const currentDay = dateMoment.date()
  const currentMonth = dateMoment.month() + 1

  const storedTasks = useQuery(Task)
  const hiddenTasks = storedTasks.filter(task => task.hidden)

  const tasksSettings = useMemo(() => {
    const result = {}
    const hiddenTasksByMasterTaskId = {}
    const tasksByDate = {}
    const masterTasks = []

    for (const hiddenTask of hiddenTasks) {
      if (!hiddenTasksByMasterTaskId[hiddenTask.parentId]) {
        hiddenTasksByMasterTaskId[hiddenTask.parentId] = new Set()
      }
      hiddenTasksByMasterTaskId[hiddenTask.parentId].add(hiddenTask.startDate)
    }

    for (const task of storedTasks) {
      if (task.hidden || task.typeId !== TaskType.Custom) {
        continue
      }

      if (task.active && !task.repeatOptions?.type) {
        if (!tasksByDate[task.startDate]) {
          tasksByDate[task.startDate] = [task]
        } else {
          tasksByDate[task.startDate].push(task)
        }
      }

      if (task.active && task.repeatOptions?.type) {
        masterTasks.push(task)
      }

      const taskStartDate = task.startDate
      const repeatType = task.repeatOptions?.type

      const endDate = moment(task.endDate)
      const isEndDateExist = !!task.endDate
      const currentDate = moment(day)

      const isAfterStartDate = moment(taskStartDate) < currentDate

      const isNeedToHide = hiddenTasksByMasterTaskId?.[task.id]?.has(day)

      let show = false

      if (!isNeedToHide) {
        if (taskStartDate === day) {
          show = true
        } else {
          if (isAfterStartDate) {
            const isEndDateAfterCurrentDay =
              endDate.isAfter(currentDate) || endDate.isSame(currentDate)

            if (repeatType === RepeatOption.Day) {
              const daysOfWeek = task.repeatOptions?.daysOfWeek

              if (!isEndDateExist) {
                if (daysOfWeek?.[currentWeekday] === true) {
                  show = true
                }
              } else {
                if (
                  daysOfWeek?.[currentWeekday] === true &&
                  isEndDateAfterCurrentDay
                ) {
                  show = true
                }
              }
            }

            if (repeatType === RepeatOption.Month) {
              const isLastDayOfMonth = task.repeatOptions?.isLastDayOfMonth
              const isDayLastOfMonth = moment(day).isSame(
                moment(day).endOf('month'),
                'day'
              )

              if (!isEndDateExist) {
                if (
                  new Set(task.repeatOptions?.daysOfMonth).has(currentDay) ||
                  (isLastDayOfMonth && isDayLastOfMonth)
                ) {
                  show = true
                }
              } else {
                if (
                  (new Set(task.repeatOptions?.daysOfMonth).has(currentDay) ||
                    (isLastDayOfMonth && isDayLastOfMonth)) &&
                  isEndDateAfterCurrentDay
                ) {
                  show = true
                }
              }
            }

            if (repeatType === RepeatOption.Year) {
              const dateOfYear = moment(task.repeatOptions?.dateOfYear)

              if (!isEndDateExist) {
                if (
                  dateOfYear.month() + 1 === currentMonth &&
                  dateOfYear.date() === currentDay
                ) {
                  show = true
                }
              } else {
                if (
                  dateOfYear.month() + 1 === currentMonth &&
                  dateOfYear.date() === currentDay &&
                  isEndDateAfterCurrentDay
                ) {
                  show = true
                }
              }
            }
          }
        }
      }

      result[task.id] = {
        hiddenDates: hiddenTasksByMasterTaskId?.[task.id],
        repeatDays:
          task.repeatOptions?.type === RepeatOption.Month
            ? new Set(task.repeatOptions?.daysOfMonth)
            : null,
        show,
      }
    }

    return {
      tasksByDate,
      masterTasks,
      result,
    }
  }, [storedTasks, date])

  const tasks = storedTasks
    .filtered('startDate == $0', day)
    .sorted(settings.sortTasksByPriority ? 'priorityId' : 'createdAt')

  const hiddenTasksRef = useRef(hiddenTasks)

  useEffect(() => {
    hiddenTasksRef.current = hiddenTasks
  }, [hiddenTasks])

  const repeatTasks = storedTasks
    .sorted(settings.sortTasksByPriority ? 'priorityId' : 'createdAt')
    .filter(task => {
      return tasksSettings?.result?.[task.id]?.show
    })

  const activeTasks = repeatTasks.filter(
    task => task.active && task.typeId === TaskType.Custom
  )

  const aututasks = tasks
    .sorted('active', true)
    .filtered('typeId != $0', TaskType.Custom)

  const inactiveTasks = repeatTasks.filter(
    task =>
      !task.active && task.startDate === day && task.typeId === TaskType.Custom
  )

  const allTasks = [
    ...activeTasks,
    ...(aututasks.length ? [{ id: 'autoTasksHeader' }, ...aututasks] : []),
    ...(inactiveTasks.length
      ? [{ id: 'inactiveTasksHeader' }, ...inactiveTasks]
      : []),
  ]

  useEffect(() => {
    dispatch(setTasksDate(moment().format(DATE_FORMAT)))
  }, [moment])

  const noActiveTasks = !activeTasks.length
  const header = useMemo(() => {
    return <Header calendarRef={calendarRef} noActiveTasks={noActiveTasks} />
  }, [noActiveTasks])

  return (
    <>
      <HiddenTasksContext.Provider value={hiddenTasksRef}>
        <TasksSettingsContext.Provider value={{ tasksSettings }}>
          <FlatList
            ListHeaderComponent={header}
            data={allTasks}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingBottom: isSubscribed ? 40 : 108 + 40,
            }}
          />

          {!isSubscribed && <PromotionOverlay />}
        </TasksSettingsContext.Provider>
      </HiddenTasksContext.Provider>
    </>
  )
}

const renderItem = ({ item, index }) => {
  return (
    <MemorizedItem
      item={item}
      key={item.id}
      index={index}
      active={item.active}
      updatedAt={item.updatedAt}
    />
  )
}

const Item = ({ item, index }) => {
  const { t } = useTranslation()

  if (item.id === 'autoTasksHeader') {
    return (
      <View
        style={{
          marginTop: 16,
          paddingTop: 16,
          paddingBottom: 8,
          // paddingVertical: 16,
          paddingHorizontal: W_H_PADDING,
        }}
      >
        <Text style={{ color: Color.LightGrey }}>
          {t('autotasks-for-productivity')}
        </Text>
      </View>
    )
  }

  if (item.id === 'inactiveTasksHeader') {
    return (
      <View
        style={{
          marginTop: 16,
          paddingTop: 16,
          paddingBottom: 8,
          // paddingVertical: 16,
          paddingHorizontal: W_H_PADDING,
        }}
      >
        <Text style={{ color: Color.LightGrey }}>{t('completed-tasks')}</Text>
      </View>
    )
  }

  return (
    <View
      key={item.id}
      style={[
        // index > 0 && {
        //   marginTop: 8,
        // },
        { marginVertical: 4 },
        { marginHorizontal: W_H_PADDING },
      ]}
    >
      {item.typeId === TaskType.Achievement && (
        <InputTaskItem task={item} title={t('task.achivement-of-the-day')} />
      )}
      {item.typeId === TaskType.GoalReading && (
        <GoalReadingTaskItem task={item} />
      )}
      {item.typeId === TaskType.Gratitude && (
        <InputTaskItem task={item} title={t('task.gratitude')} />
      )}
      {item.typeId === TaskType.DayAnalysis && (
        <InputTaskItem task={item} title={t('task.day-analysis')} />
      )}
      {item.typeId === TaskType.Custom && <TaskItem task={item} />}
    </View>
  )
}

const MemorizedItem = memo(Item, (a, b) => {
  return a.active === b.active && a.updatedAt === b.updatedAt
})

const Header = ({ calendarRef, noActiveTasks }) => {
  const { language } = useSettings()
  const moment = useMoment()
  const today = moment().format(DATE_FORMAT)
  const { t } = useTranslation()
  const date = useSelector(s => s.app.date)
  const dateMoment = moment(date)
  const day = dateMoment.format(DATE_FORMAT)

  return (
    <>
      <View>
        <TasksHeader ref={calendarRef} key={language} />
      </View>

      <View
        style={{
          paddingBottom: 16,
          paddingHorizontal: W_H_PADDING,
        }}
      >
        <Text style={{ color: Color.LightGrey }}>
          {today === day
            ? t('tasks-for-today')
            : t('tasks-for', { date: dateMoment.format('LL') })}
        </Text>
      </View>
      {noActiveTasks && (
        <View style={{ paddingHorizontal: W_H_PADDING }}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('~assets/images/no-tasks.png')}
              style={{ width: 120, height: 120 }}
            />

            <Text style={{ marginTop: 16, color: Color.LightGrey }}>
              {t('tasks.no-tasks')}
            </Text>
          </View>
        </View>
      )}
    </>
  )
}

export default TasksScreen
