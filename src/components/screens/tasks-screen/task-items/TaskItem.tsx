import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'
import Surface from '~/components/ui/surface/Surface'
import Text, { RNText } from '~/components/ui/text/Text'
import { useObject, useQuery, useRealm } from '~/db'
import { Task, TaskRepository } from '~/db/models/task'
import { Color } from '~/styles/color'
import { Checkbox, Section } from './elements'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import Icon from '~/components/ui/icons/Icon'
import { W_H_PADDING } from '~/styles'
import Button from '~/components/ui/buttons/Button'
import { ModalService } from '~/components/modal-service'
import DialogModal from '~/components/modal-service/modal-components/DialogModal'
import { uuid, uuidStr } from '~/utils/common'
import { useMoment } from '~/modules/hooks/use-moment'
import { DATE_FORMAT, Priority, RepeatOption, TaskType } from '~/constants'
import { navigationStore } from '~/navigation/navigation-store'
import Divider from '~/components/ui/surface/Divider'
import { DateUtils } from '~/utils/date'
import { useSettings } from '~/modules/hooks/use-settings'
import { BlurView } from '@react-native-community/blur'
import { Modal, Portal } from 'react-native-paper'
import crashlytics from '~/services/firebase/crashlytics'
import { Toast } from '~/modules/toast'
import { useSelector } from '~/store/utils'
import { HiddenTasksContext } from '~/screens/TasksScreen'
import { taskCountByDate } from '~/modules/tasks.ts'
import analytics from '@react-native-firebase/analytics'

const TaskItem = ({ task }) => {
  const moment = useMoment()
  const realm = useRealm()
  const { t } = useTranslation()
  const date = useSelector(s => s.app.date)
  const dateMoment = moment(date)
  const day = dateMoment.format(DATE_FORMAT)

  const hiddenTasksRef = useContext(HiddenTasksContext)

  const [modalVisible, setModalVisible] = useState(false)

  if (!task?.isValid?.()) {
    return null
  }

  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  const getNextActiveDay = () => {
    const type = task.repeatOptions?.type
    const today = moment(task.startDate)
    const endDate = moment(task.endDate)

    const fitHiddenTaskDates = hiddenTasksRef.current
      ?.filter(hTask => hTask.parentId === task.id)
      .map(hTask => hTask.startDate)

    if (type === RepeatOption.Day) {
      const currentDayIndex = (today.day() + 6) % 7
      const weekLength = task.repeatOptions?.daysOfWeek?.length

      for (let i = 0; i < weekLength; i++) {
        const nextDayIndex = (currentDayIndex + i) % weekLength
        const nextDate = today.clone().add(i, 'days')
        if (task.endDate) {
          if (
            task.repeatOptions?.daysOfWeek?.[nextDayIndex] &&
            nextDate.isBefore(endDate) &&
            !nextDate.isSame(today) &&
            !fitHiddenTaskDates.some(fitDate =>
              moment(fitDate).isSame(nextDate)
            )
          ) {
            return today.clone().add(i, 'days').format(DATE_FORMAT)
          }
        } else {
          if (
            task.repeatOptions?.daysOfWeek?.[nextDayIndex] &&
            !nextDate.isSame(today) &&
            !fitHiddenTaskDates.some(fitDate =>
              moment(fitDate).isSame(nextDate)
            )
          ) {
            return today.clone().add(i, 'days').format(DATE_FORMAT)
          }
        }
      }

      return null
    }

    if (type === RepeatOption.Month) {
      const activeDays = task.repeatOptions?.daysOfMonth
      const isLastDayOfMonth = task.repeatOptions?.isLastDayOfMonth
      const currentMonthDay = today.clone().date()

      let nextActiveDay = null

      for (let d of activeDays) {
        if (d > currentMonthDay) {
          nextActiveDay = today.clone().date(day)
          if (task.endDate) {
            if (
              nextActiveDay.isBefore(endDate) &&
              !fitHiddenTaskDates.some(fitDate =>
                moment(fitDate).isSame(nextActiveDay)
              )
            ) {
              break
            } else {
              nextActiveDay = null
            }
          } else {
            if (
              !fitHiddenTaskDates.some(fitDate =>
                moment(fitDate).isSame(nextActiveDay)
              )
            ) {
              break
            } else {
              nextActiveDay = null
            }
          }
        }
      }

      if (!nextActiveDay && isLastDayOfMonth) {
        nextActiveDay = today.clone().endOf('month').startOf('day')

        if (task.endDate) {
          if (
            nextActiveDay.isAfter(endDate) ||
            nextActiveDay.isSame(today) ||
            !fitHiddenTaskDates.some(fitDate =>
              moment(fitDate).isSame(nextActiveDay)
            )
          ) {
            nextActiveDay = null
          }
        }
      } else {
        if (
          nextActiveDay.isSame(today) ||
          !fitHiddenTaskDates.some(fitDate =>
            moment(fitDate).isSame(nextActiveDay)
          )
        ) {
          nextActiveDay = null
        }
      }

      if (!nextActiveDay) {
        const nextMonth = today.clone().add(1, 'month')

        for (let d of activeDays) {
          if (d < nextMonth.daysInMonth()) {
            nextActiveDay = moment(nextMonth).date(day)

            if (task.endDate) {
              if (
                nextActiveDay.isBefore(endDate) &&
                !fitHiddenTaskDates.some(fitDate =>
                  moment(fitDate).isSame(nextActiveDay)
                )
              ) {
                break
              } else {
                nextActiveDay = null
              }
            } else {
              if (
                !fitHiddenTaskDates.some(fitDate =>
                  moment(fitDate).isSame(nextActiveDay)
                )
              ) {
                break
              } else {
                nextActiveDay = null
              }
            }
          }
        }
      }

      return nextActiveDay ? nextActiveDay.format(DATE_FORMAT) : null
    }

    if (type === RepeatOption.Year) {
      const dateOfYear = moment(task.repeatOptions?.dateOfYear)
      const nextYearDate = dateOfYear.clone().add(1, 'year')

      if (dateOfYear.isAfter(today)) {
        if (
          dateOfYear.isBefore(endDate) &&
          !fitHiddenTaskDates.some(fitDate =>
            moment(fitDate).isSame(dateOfYear)
          )
        ) {
          return dateOfYear.format(DATE_FORMAT)
        }
      } else {
        if (
          nextYearDate.isBefore(endDate) &&
          !nextYearDate.isSame(today) &&
          !fitHiddenTaskDates.some(fitDate =>
            moment(fitDate).isSame(dateOfYear)
          )
        ) {
          return nextYearDate.format(DATE_FORMAT)
        }
      }

      return null
    }
  }

  const onDeleteCurrentTask = task => {
    if (task.startDate === day) {
      taskCountByDate.delete(task.startDate)
      const nextActiveDay = getNextActiveDay()

      if (nextActiveDay) {
        realm.write(() => {
          new TaskRepository(realm).upsert(task.id, {
            goal: task.goal[0],
            startDate: nextActiveDay,
          })
        })
      } else {
        hiddenTasksRef.current?.forEach(hiddenTask => {
          if (hiddenTask.parentId === task._id.toString()) {
            realm.write(() => {
              crashlytics().log('task delete at TaskItem')
              new TaskRepository(realm).delete(hiddenTask)
            })
          }
        })
        realm.write(() => {
          crashlytics().log('task delete at TaskItem')
          new TaskRepository(realm).delete(task)
        })
      }
    } else {
      taskCountByDate.delete(day)
      realm.write(() => {
        new TaskRepository(realm).upsert(undefined, {
          goal: task.goal[0],
          name: task.name,
          active: task.active,
          startDate: day,
          startTime: task.startTime,
          endTime: task.endTime,
          typeId: TaskType.Custom,
          priorityId: task.priorityId,
          notificationTime: task.notificationTime,
          notificationDate: task.notificationDate,
          repeatOptions: task.repeatOptions,
          endDate: task.endDate,
          parentId: task.id,
          hidden: true,
        })
      })
    }
  }

  const onCompletelyDeleteTask = task => {
    taskCountByDate.clear()
    if (task.startDate === day) {
      hiddenTasksRef.current?.forEach(hiddenTask => {
        if (hiddenTask.parentId === task._id.toString()) {
          realm.write(() => {
            crashlytics().log('task delete at TaskItem')
            new TaskRepository(realm).delete(hiddenTask)
          })
        }
      })
      realm.write(() => {
        crashlytics().log('task delete at TaskItem')
        new TaskRepository(realm).delete(task)
      })
    } else {
      realm.write(() => {
        new TaskRepository(realm).upsert(task.id, {
          goal: task.goal[0],
          endDate: moment(day).subtract(1, 'days').format(DATE_FORMAT),
        })
      })
    }
  }

  const deleteHandler = async () => {
    const id = uuidStr()
    await ModalService.showModal(DialogModal, {
      id,
      title: t('warning'),
      renderBody: () => (
        <Text style={{ color: Color.LightGrey }}>
          <RNText>{t('task-deletion-modal.body.begin')} </RNText>
          <RNText style={{ color: Color.White }}>{task.name} </RNText>
          <RNText>{t('task-deletion-modal.body.end')}</RNText>
        </Text>
      ),
      renderFooter: () =>
        task.repeatOptions?.type ? (
          <View style={{ gap: 8 }}>
            <Button
              title={t('cancel')}
              onPress={() => ModalService.closeModal(id)}
            />
            <Button
              title={t('task.delete')}
              style={{
                backgroundColor: Color.AccentRed,
                borderColor: Color.AccentRed,
              }}
              onPress={() => {
                ModalService.closeModal(id)
                onDeleteCurrentTask(task)
              }}
            />
            <Button
              title={t('task.delete-completely')}
              style={{
                backgroundColor: Color.AccentRed,
                borderColor: Color.AccentRed,
              }}
              onPress={() => {
                ModalService.closeModal(id)
                onCompletelyDeleteTask(task)
              }}
            />
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <Button
              title={t('cancel')}
              containerStyle={{ flex: 1 }}
              onPress={() => ModalService.closeModal(id)}
            />
            <Button
              title={t('yes-delete')}
              containerStyle={{ flex: 1, marginLeft: 8 }}
              style={{
                backgroundColor: Color.AccentRed,
                borderColor: Color.AccentRed,
              }}
              onPress={() => {
                ModalService.closeModal(id)
                taskCountByDate.delete(task.startDate)
                realm.write(() => {
                  crashlytics().log('task delete at TaskItem')
                  new TaskRepository(realm).delete(task)
                })
              }}
            />
          </View>
        ),
    }).catch(() => 0)
  }

  const completed = !task.active

  const onEditPress = () => {
    closeModal()
    navigationStore.taskFormRef.current.open({ taskId: task.id, day: day })
  }
  const onForTomorrowPress = () => {
    // const tomorrow = moment().add(1, 'day').format(DATE_FORMAT)
    if (day === task.startDate) {
      const tomorrow = moment(task.startDate).add(1, 'day').format(DATE_FORMAT)
      taskCountByDate.delete(task.startDate)
      taskCountByDate.delete(tomorrow)
      closeModal()
      realm.write(() => {
        task.startDate = tomorrow
      })
    } else {
      const tomorrow = moment(day).add(1, 'day').format(DATE_FORMAT)
      const yesterday = moment(day).subtract(1, 'day').format(DATE_FORMAT)
      closeModal()
      realm.write(() => {
        new TaskRepository(realm).upsert(undefined, {
          goal: task?.goal?.[0],
          name: task.name.trim(),
          active: task.active,
          startDate: tomorrow,
          startTime: task.startTime,
          endTime: task.endTime,
          typeId: TaskType.Custom,
          priorityId: task.priorityId,
          notificationTime: task.notificationTime,
          notificationDate: task.notificationDate,
          repeatOptions: task.repeatOptions,
          endDate: task.endDate === day ? tomorrow : task.endDate,
          parentId: task.id,
        })
        task.endDate = yesterday
      })
      taskCountByDate.clear()
    }
  }

  const getRepeatOptions = () => {
    if (task.repeatOptions?.type === RepeatOption.Day) {
      const daysNames = Array.from({ length: 7 }, (_, index) => {
        const dayName = moment().weekday(index).format('dd')
        return dayName.charAt(0).toUpperCase() + dayName.slice(1)
      })

      const daysOfWeek = task.repeatOptions.daysOfWeek

      const activeDays = daysOfWeek
        ?.map((isActive, index) => (isActive ? daysNames[index] : null))
        .filter(day => day !== null)
        .join(', ')

      return `${t('task.repeat.day')} ${activeDays}`
    }

    if (task.repeatOptions?.type === RepeatOption.Month) {
      const activeDays = task.repeatOptions.daysOfMonth?.join(', ')

      return task.repeatOptions.daysOfMonth?.length > 0
        ? `${t('task.repeat.month')} ${activeDays} ${
            task.repeatOptions.isLastDayOfMonth
              ? t('task.repeat.include-last-day-of-month')
              : ''
          }`
        : `${t('task.repeat.month')} ${
            task.repeatOptions.isLastDayOfMonth
              ? t('task.repeat.last-day-of-month')
              : ''
          }`
    }

    if (task.repeatOptions?.type === RepeatOption.Year) {
      return `${t('task.repeat.year')} ${moment(
        task.repeatOptions.dateOfYear
      ).format('D MMMM')}`
    }
  }

  return (
    <>
      <Surface
        style={[
          { padding: 0 },
          completed && {
            backgroundColor: Color.Black,
            borderWidth: 1,
            borderColor: Color.Grey,
          },
        ]}
        foregroundRipple
        onPress={openModal}
      >
        <TaskLayout task={task} faded={completed} currentDay={day} />
      </Surface>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={closeModal}
          style={{ marginTop: 0, marginBottom: 0 }}
          contentContainerStyle={{ height: '100%' }}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: W_H_PADDING,
              justifyContent: 'center',
            }}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeModal}>
              {/* <View style={{ height: '100%', backgroundColor: '#00000099' }} /> */}
              <BlurView
                blurType="extraDark"
                blurAmount={2}
                reducedTransparencyFallbackColor={'#000'}
                style={{ height: '100%' }}
              />
            </Pressable>

            <Surface style={{ padding: 0 }}>
              <TaskLayout
                task={task}
                modalMode
                onClose={closeModal}
                currentDay={day}
              />

              <Divider />

              {task.repeatOptions && (
                <View
                  style={{
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Icon name={'refresh'} size={14} />
                  <Text
                    style={{
                      fontWeight: '400',
                      fontSize: 12,
                      lineHeight: 16,
                      paddingRight: 16,
                    }}
                  >
                    {getRepeatOptions()}
                  </Text>
                </View>
              )}

              <Divider />

              <View style={{ padding: 12, flexDirection: 'row' }}>
                <Button
                  style={{ borderColor: Color.AccentRed }}
                  onPress={deleteHandler}
                >
                  <Icon name="trash" style={{ tintColor: Color.AccentRed }} />
                </Button>
                <Button
                  title={t('task-action.edit')}
                  containerStyle={{ flex: 1, marginLeft: 8 }}
                  onPress={onEditPress}
                />
                <Button
                  title={t('task-action.for-tomorrow')}
                  containerStyle={{ flex: 1, marginLeft: 8 }}
                  style={{ backgroundColor: Color.AccentBlue }}
                  onPress={onForTomorrowPress}
                />
              </View>
            </Surface>
          </View>
        </Modal>
      </Portal>
    </>
  )
}

const priorityNameById = {
  [Priority.NotSpecified]: 'priority.not-definded',
  [Priority.Main]: 'priority.main',
  [Priority.A]: 'priority.a',
  [Priority.B]: 'priority.b',
  [Priority.C]: 'priority.c',
  [Priority.D]: 'priority.d',
}

const TaskLayout: React.FC<{
  task: Task
  faded?: boolean
  modalMode?: boolean
  currentDay?: string
  onClose?: () => void
}> = ({ task, faded, modalMode, currentDay, onClose }) => {
  const realm = useRealm()
  //   const task = useObject(Task, uuid(taskId))
  const { t } = useTranslation()
  const moment = useMoment()
  const settings = useSettings()

  const completed = !task.active
  const priorityColor = completed
    ? Color.LightGrey
    : task.priorityId === Priority.Main
    ? '#FFBC57'
    : Color.LightGrey

  const getNextActiveDay = date => {
    const type = task.repeatOptions?.type
    const today = moment(date)
    const endDate = moment(task.endDate)

    if (type === RepeatOption.Day) {
      const currentDayIndex = (today.day() + 6) % 7
      const weekLength = task.repeatOptions?.daysOfWeek?.length

      for (let i = 0; i < weekLength; i++) {
        const nextDayIndex = (currentDayIndex + i) % weekLength
        const nextDate = today.clone().add(i, 'days')

        if (task.endDate) {
          if (
            task.repeatOptions?.daysOfWeek?.[nextDayIndex] &&
            nextDate.isSameOrBefore(endDate) &&
            !nextDate.isSame(today)
          ) {
            return today.clone().add(i, 'days').format(DATE_FORMAT)
          }
        } else {
          if (
            task.repeatOptions?.daysOfWeek?.[nextDayIndex] &&
            !nextDate.isSame(today)
          ) {
            return today.clone().add(i, 'days').format(DATE_FORMAT)
          }
        }
      }

      return null
    }

    if (type === RepeatOption.Month) {
      const activeDays = task.repeatOptions?.daysOfMonth
      const isLastDayOfMonth = task.repeatOptions?.isLastDayOfMonth
      const currentMonthDay = today.clone().date()

      let nextActiveDay = null

      for (let day of activeDays) {
        if (day > currentMonthDay) {
          nextActiveDay = today.clone().date(day)

          if (task.endDate) {
            if (nextActiveDay.isSameOrBefore(endDate)) {
              break
            } else {
              nextActiveDay = null
            }
          } else {
            break
          }
        }
      }

      if (!nextActiveDay && isLastDayOfMonth) {
        nextActiveDay = today.clone().endOf('month').startOf('day')

        if (task.endDate) {
          if (nextActiveDay.isAfter(endDate) || nextActiveDay.isSame(today)) {
            nextActiveDay = null
          }
        } else {
          if (nextActiveDay.isSame(today)) {
            nextActiveDay = null
          }
        }
      }

      if (!nextActiveDay) {
        const nextMonth = today.clone().add(1, 'month')

        for (let day of activeDays) {
          if (day < nextMonth.daysInMonth()) {
            nextActiveDay = moment(nextMonth).date(day)

            if (task.endDate) {
              if (nextActiveDay.isSameOrBefore(endDate)) {
                break
              } else {
                nextActiveDay = null
              }
            } else {
              break
            }
          }
        }
      }

      return nextActiveDay ? nextActiveDay.format(DATE_FORMAT) : null
    }

    if (type === RepeatOption.Year) {
      const dateOfYear = moment(task.repeatOptions?.dateOfYear)
      const nextYearDate = dateOfYear.clone().add(1, 'year')

      if (dateOfYear.isAfter(today)) {
        if (task.endDate) {
          if (dateOfYear.isSameOrBefore(endDate)) {
            return dateOfYear.format(DATE_FORMAT)
          }
        } else {
          return dateOfYear.format(DATE_FORMAT)
        }
      } else {
        if (task.endDate) {
          if (
            nextYearDate.isSameOrBefore(endDate) &&
            !nextYearDate.isSame(today)
          ) {
            return nextYearDate.format(DATE_FORMAT)
          }
        } else {
          if (!nextYearDate.isSame(today)) {
            return nextYearDate.format(DATE_FORMAT)
          }
        }
      }

      return null
    }
  }

  const toggleTask = () => {
    const taskDeadline = task.endTime
      ? moment(`${task.startDate}T${task.endTime}`)
      : null
    const now = moment()
    const delayMin = task.endTime ? now.diff(taskDeadline, 'minutes') : 0

    if (!task.repeatOptions?.type) {
      taskCountByDate.delete(task.startDate)
      analytics().logEvent('complete_task', {
        delay_min: delayMin,
        was_repeated: false,
      })
      realm.write(() => {
        new TaskRepository(realm).upsert(task.id, {
          goal: task.goal[0],
          active: !task.active,
        })
      })
    } else {
      if (task.active) {
        analytics().logEvent('complete_task', {
          delay_min: delayMin,
          was_repeated: true,
        })
        if (task.startDate === currentDay) {
          taskCountByDate.delete(task.startDate)
          const nextActiveDay = getNextActiveDay(task.startDate)

          if (nextActiveDay) {
            realm.write(() => {
              new TaskRepository(realm).upsert(undefined, {
                ...task,
                goal: task.goal[0],
                name: task.name,
                active: !task.active,
                startDate: task.startDate,
                startTime: task.startTime,
                endTime: task.endTime,
                typeId: TaskType.Custom,
                priorityId: task.priorityId ?? Priority.NotSpecified,
                notificationTime: task.notificationTime,
                notificationDate: task.notificationDate,
                repeatOptions: task.repeatOptions,
                endDate: task.endDate,
                parentId: task.id,
              })
            })

            realm.write(() => {
              new TaskRepository(realm).upsert(task.id, {
                goal: task.goal[0],
                startDate: nextActiveDay,
              })
            })
          } else {
            realm.write(() => {
              new TaskRepository(realm).upsert(undefined, {
                ...task,
                goal: task.goal[0],
                name: task.name,
                active: !task.active,
                startDate: task.startDate,
                startTime: task.startTime,
                endTime: task.endTime,
                typeId: TaskType.Custom,
                priorityId: task.priorityId ?? Priority.NotSpecified,
                notificationTime: task.notificationTime,
                notificationDate: task.notificationDate,
                repeatOptions: task.repeatOptions,
                endDate: task.endDate,
                parentId: task.parentId ?? task.id,
              })
            })
            realm.write(() => {
              crashlytics().log('task delete at TaskItem')
              new TaskRepository(realm).delete(task)
            })
          }
        } else {
          taskCountByDate.delete(currentDay)
          const nextActiveDay = getNextActiveDay(currentDay)

          if (nextActiveDay) {
            realm.write(() => {
              new TaskRepository(realm).upsert(undefined, {
                ...task,
                goal: task.goal[0],
                name: task.name,
                active: !task.active,
                startDate: currentDay,
                startTime: task.startTime,
                endTime: task.endTime,
                typeId: TaskType.Custom,
                priorityId: task.priorityId ?? Priority.NotSpecified,
                notificationTime: task.notificationTime,
                notificationDate: task.notificationDate,
                repeatOptions: task.repeatOptions,
                endDate: currentDay,
              })
            })

            realm.write(() => {
              new TaskRepository(realm).upsert(undefined, {
                ...task,
                goal: task.goal[0],
                name: task.name,
                active: task.active,
                startDate: nextActiveDay,
                startTime: task.startTime,
                endTime: task.endTime,
                typeId: TaskType.Custom,
                priorityId: task.priorityId ?? Priority.NotSpecified,
                notificationTime: task.notificationTime,
                notificationDate: task.notificationDate,
                repeatOptions: task.repeatOptions,
                endDate: task.endDate,
              })
            })

            realm.write(() => {
              new TaskRepository(realm).upsert(task.id, {
                goal: task.goal[0],
                endDate: moment(currentDay)
                  .subtract(1, 'days')
                  .format(DATE_FORMAT),
              })
            })
          } else {
            realm.write(() => {
              new TaskRepository(realm).upsert(undefined, {
                ...task,
                goal: task.goal[0],
                name: task.name,
                active: !task.active,
                startDate: currentDay,
                startTime: task.startTime,
                endTime: task.endTime,
                typeId: TaskType.Custom,
                priorityId: task.priorityId ?? Priority.NotSpecified,
                notificationTime: task.notificationTime,
                notificationDate: task.notificationDate,
                repeatOptions: task.repeatOptions,
                endDate: currentDay,
              })
            })

            realm.write(() => {
              new TaskRepository(realm).upsert(task.id, {
                goal: task.goal[0],
                endDate: moment(currentDay)
                  .subtract(1, 'days')
                  .format(DATE_FORMAT),
              })
            })
          }
        }
      } else {
        taskCountByDate.delete(task.startDate)
        const parentId = task.parentId

        if (parentId) {
          realm.write(() => {
            new TaskRepository(realm).upsert(parentId, {
              ...task,
              goal: task.goal[0],
              startDate: task.startDate,
              name: task.name,
              active: !task.active,
              startTime: task.startTime,
              endTime: task.endTime,
              typeId: TaskType.Custom,
              priorityId: task.priorityId ?? Priority.NotSpecified,
              notificationTime: task.notificationTime,
              notificationDate: task.notificationDate,
              repeatOptions: task.repeatOptions,
              endDate: task.endDate,
            })
          })

          realm.write(() => {
            crashlytics().log('task delete at TaskItem')
            new TaskRepository(realm).delete(task)
          })
        } else {
          realm.write(() => {
            new TaskRepository(realm).upsert(task.id, {
              goal: task.goal[0],
              active: !task.active,
            })
          })
        }
      }
    }
  }

  return (
    <>
      {task.goal.length > 0 && (
        <>
          <Section>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View
                style={{
                  borderRadius: 4,
                  backgroundColor: faded ? Color.Dark : Color.AccentBlue,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                }}
              >
                <Text
                  style={[
                    { fontSize: 12, lineHeight: 16 },
                    completed && { textDecorationLine: 'line-through' },
                    faded && { color: Color.LightGrey },
                  ]}
                >
                  {t('task.goal')}
                </Text>
              </View>

              <Text
                style={[
                  { flex: 1, marginLeft: 8, color: Color.LightGrey },
                  completed && { textDecorationLine: 'line-through' },
                ]}
              >
                {task.goal[0].name}
              </Text>

              {onClose && (
                <PressableOpacity
                  containerStyle={{ marginLeft: 8 }}
                  hitSlop={15}
                  onPress={onClose}
                >
                  <Icon name="close" />
                </PressableOpacity>
              )}
            </View>
          </Section>
          <Divider />
        </>
      )}
      <Section style={{ zIndex: 2 }}>
        <Checkbox
          label={task.name}
          checked={!task.active}
          onCheck={toggleTask}
        />
      </Section>
      <Divider />
      <Section>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="clock" size={14} style={{ tintColor: Color.LightGrey }} />
          <Text
            style={[
              {
                marginLeft: 4,
                fontSize: 12,
                lineHeight: 16,
                color: Color.LightGrey,
              },
              completed && { textDecorationLine: 'line-through' },
            ]}
          >
            {task.startTime
              ? new DateUtils(moment, settings.is12hFormat).formatTime(
                  task.startTime
                )
              : !task.startTime && task.endTime
              ? `${t('task.end-time.only')}${new DateUtils(
                  moment,
                  settings.is12hFormat
                ).formatTime(task.endTime)}`
              : t('task.all-day')}
            {task.startTime &&
              task.endTime &&
              ` - ${new DateUtils(moment, settings.is12hFormat).formatTime(
                task.endTime
              )}`}
          </Text>
          {task.repeatOptions && !modalMode && (
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center',
                marginLeft: 50,
              }}
            >
              <Icon
                name="refresh"
                size={14}
                style={{ tintColor: Color.LightGrey }}
              />
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  color: Color.LightGrey,
                }}
              >
                {t('task.repeat')}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }} />
          {task.priorityId !== Priority.NotSpecified && (
            <>
              <Icon
                name="mark"
                size={16}
                style={{ tintColor: priorityColor }}
              />
              <Text
                style={[
                  {
                    fontSize: 12,
                    lineHeight: 16,
                    color: priorityColor,
                  },
                  completed && { textDecorationLine: 'line-through' },
                ]}
              >
                {t(priorityNameById[task.priorityId])}
              </Text>
            </>
          )}
        </View>
      </Section>
    </>
  )
}

export default TaskItem
