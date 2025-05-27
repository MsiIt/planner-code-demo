import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  BottomSheetModal as BSModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import BottomSheetModal from '../ui/bottom-sheet/BottomSheetModal'
import { Menu } from 'react-native-paper'
import Text, { RNText } from '../ui/text/Text'
import { W_H_PADDING } from '~/styles'
import { useObject, useQuery, useRealm } from '~/db'
import { Category } from '~/db/models/category'
import { nextFrame, uuid, uuidStr } from '~/utils/common'
import { Color } from '~/styles/color'
import { useTranslation } from 'react-i18next'
import { Goal, GoalRepository } from '~/db/models/goal'
import Surface from '../ui/surface/Surface'
import { Checkbox, Section } from '../screens/tasks-screen/task-items/elements'
import PressableOpacity from '../ui/pressable/PressableOpacity'
import Icon, { IconSource } from '../ui/icons/Icon'
import { useMoment } from '~/modules/hooks/use-moment'
import AddButton from '../ui/buttons/AddButton'
import { navigationStore } from '~/navigation/navigation-store'
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated'
import { Task, TaskRepository } from '~/db/models/task'
import Pressable from '../ui/pressable/Pressable'
import TextInput from '../ui/inputs/TextInput'
import { Image, Platform, View } from 'react-native'
import KeyboardAvoidingScrollView from '../ui/views/KeyboardAvoidingScrollView'
import { DATE_FORMAT, Priority, RepeatOption, TaskType } from '~/constants'
import Divider from '../ui/surface/Divider'
import { StoriesService } from '../stories-service'
import { inputLengthLimits } from '~/constants/inputs'
import { useSelector } from '~/store/utils'
import { SubscriptionService } from '../subscription-service'
import { transformStoryGroupSource } from '~/modules/knowledge'
import {
  breakGoalsDownStoryGroup,
  goalListStoryGroup,
} from '~assets/data/ai-stories'
import { dayTimeToDate } from '~/utils/date'
import { ModalService } from '../modal-service'
import DialogModal from '../modal-service/modal-components/DialogModal'
import Button from '../ui/buttons/Button'
import crashlytics from '~/services/firebase/crashlytics'
import NotificationBanner from '../banner/NotificationBanner'
import AIButton from '../ui/buttons/AIButton'
import { NotificationService } from '~/services/notifications'
import { useSettings } from '~/modules/hooks/use-settings'
import { FontFamily } from '~/styles/typography'
import { taskCountByDate } from '~/modules/tasks'
import analytics from '@react-native-firebase/analytics'

const context = createContext({})

const CategorySheet = ({}, ref) => {
  const bottomSheetModalRef = useRef<BSModal>()

  const [params, setParams] = useState()

  const categoryId = params?.categoryId
  const category = useObject(Category, uuid(categoryId))

  const [goal, setGoal] = useState<undefined | Goal>()

  const snapPoints = useMemo(() => ['93%'], [])
  const open = async p => {
    setParams(p)
    await nextFrame()
    bottomSheetModalRef.current?.present()
  }
  const close = () => bottomSheetModalRef.current?.close()

  useImperativeHandle(
    ref,
    () => {
      return { open, close }
    },
    []
  )

  const onDismiss = () => {
    setParams()
    setGoal()
  }

  const contextValue = useMemo(() => ({ setGoal }), [])

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}
    >
      <context.Provider value={contextValue}>
        {goal ? (
          goal.isValid() ? (
            <GoalView goal={goal} />
          ) : null
        ) : category ? (
          category.isValid() ? (
            <CategoryView category={category} />
          ) : null
        ) : null}
      </context.Provider>
    </BottomSheetModal>
  )
}

const CategoryView = ({ category }: { category: Category }) => {
  const { t } = useTranslation()

  const activeGoals = category.goals.filtered('active = true')
  const inactiveGoals = category.goals.filtered('active = false')

  const addGoalHandler = () => {
    navigationStore.goalFormRef.current.open({ category })
  }

  const settings = useSettings()

  return (
    <BottomSheetScrollView
      bounces={false}
      contentContainerStyle={{
        paddingTop: 8,
        paddingBottom: 20,
        paddingHorizontal: W_H_PADDING,
      }}
    >
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 24, lineHeight: 32, textAlign: 'center' }}>
          {category.name}
        </Text>
        <Text style={{ color: Color.LightGrey, textAlign: 'center' }}>
          {t('category-view.subtitle')}
        </Text>
      </View>

      {category.goals.length > 0 && !settings.categoryBannerHidden && (
        // <View style={{ marginVertical: 16 }}>
        //   <Text style={{ color: Color.LightGrey }}>
        //     {t('category-view.caption')}
        //   </Text>
        // </View>
        <NotificationBanner id={1} />
      )}

      {activeGoals.map((g, i) => {
        return (
          <Animated.View
            key={g.id}
            layout={Layout.duration(100)}
            entering={FadeInRight.duration(100)}
            exiting={FadeOutLeft.duration(100)}
            style={i > 0 && { marginTop: 8 }}
          >
            <GoalItem goal={g} />
          </Animated.View>
        )
      })}

      {!category.goals.length && (
        <View style={{ marginTop: 72 - 16, alignItems: 'center' }}>
          <Image
            source={require('~assets/images/no-goals.png')}
            style={{ width: 327, height: 314, resizeMode: 'contain' }}
          />

          <Text
            style={{
              marginTop: 40,
              marginBottom: 40,
              color: Color.LightGrey,
              textAlign: 'center',
            }}
          >
            {t('category-view.empty-message')}{' '}
            <PressableOpacity
              hitSlop={10}
              containerStyle={{
                transform: [
                  { translateY: Platform.select({ ios: 4, default: 6 }) },
                ],
              }}
              onPress={() =>
                StoriesService.show(
                  transformStoryGroupSource(goalListStoryGroup).stories
                )
              }
            >
              <Icon name="info" style={{ tintColor: Color.LightGrey }} />
            </PressableOpacity>
          </Text>
        </View>
      )}

      <Animated.View
        key="add"
        layout={Layout.duration(100)}
        style={category.goals.length > 0 && { marginTop: 8 }}
      >
        <AddButton title={t('goals.add-goal')} onPress={addGoalHandler} />
      </Animated.View>

      {inactiveGoals.length > 0 && (
        <>
          <Animated.View
            layout={Layout.duration(100)}
            style={{ marginVertical: 16, paddingVertical: 16 }}
          >
            <Text style={{ color: Color.LightGrey }}>
              {t('completed-goals')}
            </Text>
          </Animated.View>
          {inactiveGoals.map((g, i) => {
            return (
              <Animated.View
                key={g.id}
                layout={Layout.duration(100)}
                entering={FadeInRight.duration(100)}
                exiting={FadeOutLeft.duration(100)}
                style={i > 0 && { marginTop: 8 }}
              >
                <GoalItem goal={g} />
              </Animated.View>
            )
          })}
        </>
      )}
    </BottomSheetScrollView>
  )
}

const TrashMenuIcon = ({ size }) => (
  <Icon name="trash" size={size} style={{ tintColor: Color.AccentRed }} />
)
const BoostIcon = () => (
  <View
    style={{
      marginLeft: 2,
      justifyContent: 'center',
      flex: 1,
    }}
  >
    <Image
      source={require('~assets/images/boost-lock.png')}
      style={{ top: 1, width: 46, height: 12 }}
    />
  </View>
)
const GoalItem = ({ goal }: { goal: Goal }) => {
  const realm = useRealm()
  const { t } = useTranslation()
  const moment = useMoment()
  const { setGoal } = useContext(context)

  const getCompletionPercent = tasks => {
    const tasksLength = tasks?.length

    if (tasksLength) {
      const closedTasksLength = tasks?.filter(task => !task.active)?.length

      if (closedTasksLength === 0) {
        return closedTasksLength
      } else if (tasksLength === closedTasksLength) {
        return 100
      } else {
        return Math.round((closedTasksLength / tasksLength) * 100)
      }
    } else {
      return null
    }
  }

  const toggleCompletion = async () => {
    realm.write(() => {
      new GoalRepository(realm).upsert(goal.id, { active: !goal.active })
    })

    if (!goal.active) {
      const randomNumber = Math.floor(Math.random() * 4) + 1
      await NotificationService.schedule({
        title: t(`notifications.complete-goal.title.${randomNumber}`),
        text: t(`notifications.complete-goal.text.${randomNumber}`),
        timestamp: moment().toDate().getTime() + 2000,
      })
    }
  }

  const pressHandler = () => {
    setGoal(goal)
  }

  const faded = false
  const completed = !goal.active

  const activeTasks = goal.tasks.filter(task => task.active && !task.hidden)

  return (
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
      onPress={pressHandler}
    >
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 14,
          bottom: 14,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            left: -2,
            flex: 1,
            width: 4,
            backgroundColor: Color.AccentBlue,
            borderRadius: 2,
          }}
        />
      </View>

      <Section style={{ paddingVertical: 12, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Checkbox
            label={goal.name}
            checked={!goal.active}
            labelStyle={{ color: Color.White }}
            onCheck={toggleCompletion}
          />
        </View>

        <GoalMenu goal={goal} />
      </Section>
      {goal.tasks.length > 0 && (
        <View
          style={{
            height: 2,
            marginHorizontal: 14,
            marginVertical: 4,
            borderRadius: 4,
            backgroundColor: Color.Black,
          }}
        >
          <View
            style={{
              backgroundColor: Color.AccentBlue,
              borderRadius: 12,
              flex: 1,
              width: `${getCompletionPercent(goal.tasks)}%`,
            }}
          />
        </View>
      )}
      <Section style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="clock" size={14} style={{ tintColor: Color.LightGrey }} />
        <Text
          style={{
            marginLeft: 4,
            fontSize: 12,
            lineHeight: 16,
            color: Color.LightGrey,
          }}
        >
          {t('until')} {moment(goal.deadline).format('LL')}
        </Text>
        {/* {goal.tasks.length > 0 && ( */}
        {activeTasks.length > 0 && (
          <View
            style={{
              marginLeft: 'auto',
              paddingVertical: 2,
              paddingHorizontal: 6,
              backgroundColor: faded ? Color.Dark : Color.AccentBlue,
              borderRadius: 4,
            }}
          >
            <Text
              style={[
                { fontSize: 12, lineHeight: 16 },
                completed && { textDecorationLine: 'line-through' },
                faded && { color: Color.LightGrey },
              ]}
            >
              {t('tasks.tasks', { count: activeTasks.length })}
            </Text>
          </View>
        )}
        {goal.tasks.length > 0 && activeTasks.length === 0 && (
          <View
            style={{
              marginLeft: 'auto',
              paddingVertical: 2,
              paddingHorizontal: 6,
              backgroundColor: faded ? Color.Dark : Color.AccentBlue,
              borderRadius: 4,
            }}
          >
            <Text
              style={[
                { fontSize: 12, lineHeight: 16 },
                completed && { textDecorationLine: 'line-through' },
                faded && { color: Color.LightGrey },
              ]}
            >
              {t('goal.tasks.complete')}
            </Text>
          </View>
        )}
      </Section>
    </Surface>
  )
}

const GoalMenu = ({
  goal,
  onDelete,
}: {
  goal: Goal
  onDelete?: () => Promise<any>
}) => {
  const realm = useRealm()
  const { t } = useTranslation()
  const [menuOpened, setMenuOpened] = useState(false)

  const openMenu = () => setMenuOpened(true)
  const closeMenu = () => setMenuOpened(false)

  const editHandler = () => {
    closeMenu()
    navigationStore.goalFormRef.current.open({ goalId: goal.id })
  }
  const deleteHandler = async () => {
    try {
      const goalName = goal.name
      closeMenu()

      const id = uuidStr()
      await ModalService.showModal(DialogModal, {
        id,
        title: t('warning'),
        renderBody: () => (
          <Text style={{ color: Color.LightGrey }}>
            <RNText>{t('goal-deletion-modal.body.begin')} </RNText>
            <RNText style={{ color: Color.White }}>{goalName} </RNText>
            <RNText>{t('goal-deletion-modal.body.end')}</RNText>
          </Text>
        ),
        renderFooter: () => (
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
              onPress={async () => {
                ModalService.closeModal(id)
                await onDelete?.()
                realm.write(() => {
                  crashlytics().log('goal delete at GoalMenu')
                  new GoalRepository(realm).delete(goal)
                })
                taskCountByDate.clear()
              }}
            />
          </View>
        ),
      }).catch(() => 0)
    } catch (error) {
      if (
        error.message.includes(
          'Accessing object of type Goal which has been invalidated or deleted'
        )
      ) {
        console.error('goal error:', error)
      } else {
        console.error('error', error)
      }
    }
  }

  return (
    <Menu
      visible={menuOpened}
      onDismiss={closeMenu}
      anchor={
        <PressableOpacity hitSlop={15} onPress={openMenu}>
          <Icon
            name="triple-dot"
            style={menuOpened && { tintColor: Color.AccentBlue }}
          />
        </PressableOpacity>
      }
      anchorPosition="bottom"
    >
      <Menu.Item
        title={t('action.edit')}
        leadingIcon={{ source: IconSource.edit, direction: 'ltr' }}
        onPress={editHandler}
      />
      <Menu.Item
        title={t('action.delete')}
        titleStyle={{ color: Color.AccentRed }}
        leadingIcon={TrashMenuIcon}
        onPress={deleteHandler}
      />
    </Menu>
  )
}

const GoalView = ({ goal }: { goal: Goal }) => {
  const realm = useRealm()
  const moment = useMoment()
  const { t } = useTranslation()
  const { setGoal } = useContext(context)

  const settings = useSettings()

  const activeTasks = goal.tasks
    .filtered('active = true')
    .filtered('hidden != true')
  const inactiveTasks = goal.tasks.filtered('active = false')

  const [inputEnabled, setInputEnabled] = useState(false)
  const [inputText, setInputText] = useState('')
  const addTaskPressHandler = async () => {
    setInputEnabled(true)
  }
  const onInputBlur = () => {
    if (inputText) {
      analytics().logEvent('add_task', {
        eisenhower_quad: Priority.NotSpecified,
        repeat_rule: 'none',
      })
      realm.write(() => {
        new TaskRepository(realm).upsert(undefined, {
          goal,
          active: true,
          name: inputText.trim(),
          typeId: TaskType.Custom,
          priorityId: Priority.NotSpecified,
        })
      })
    }

    setInputText('')
    setInputEnabled(false)
  }

  const onGoalDelete = () => {
    setGoal()
    return nextFrame()
  }

  return (
    <KeyboardAvoidingScrollView
      ScrollComponent={BottomSheetScrollView}
      keyboardShouldPersistTaps="handled"
      mode
      containerStyle={{
        paddingHorizontal: W_H_PADDING,
        paddingTop: 8,
        paddingBottom: 20,
      }}
    >
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <PressableOpacity hitSlop={20} onPress={() => setGoal()}>
          <Icon name="chevron-left" />
        </PressableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center' }}>{goal.name}</Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              lineHeight: 16,
              color: Color.LightGrey,
            }}
          >
            {t('until')} {moment(goal.deadline).format('LL')}
          </Text>
        </View>

        <GoalMenu goal={goal} onDelete={onGoalDelete} />
      </View>

      {!settings.goalBannerHidden && goal.tasks.length > 0 && (
        // <View style={{ marginVertical: 16 }}>
        //   <Text style={{ color: Color.LightGrey }}>
        //     {t('goal-view.caption')}
        //   </Text>
        // </View>
        <NotificationBanner id={2} />
      )}

      {(goal.tasks.length > 0 || inputEnabled) && (
        <Surface style={{ padding: 0 }}>
          {activeTasks.map((t, i) => {
            return (
              <View key={t.id}>
                {i > 0 && <Divider />}
                <TaskItem task={t} />
              </View>
            )
          })}
          {!inputEnabled && (
            <Pressable
              style={[
                {
                  backgroundColor: Color.AccentBlue,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                },
                !activeTasks.length && { borderRadius: 8 },
              ]}
              onPress={addTaskPressHandler}
            >
              <Icon name="plus" />
              <Text style={{ fontSize: 12, lineHeight: 16, marginLeft: 8 }}>
                {t('task-form.title.add')}
              </Text>
            </Pressable>
          )}
          {inputEnabled && (
            <>
              <Divider />
              <TaskAdding
                value={inputText}
                setValue={t => setInputText(t)}
                onSave={onInputBlur}
                onCancel={() => {
                  setInputText('')
                  setInputEnabled(false)
                }}
              />
            </>
          )}
        </Surface>
      )}

      {!goal.tasks.length && (
        <>
          <View style={{ marginTop: 72 - 16, alignItems: 'center' }}>
            <Image
              source={require('~assets/images/no-tasks-2.png')}
              style={{ width: 186, height: 200, resizeMode: 'contain' }}
            />

            <Text
              style={{
                marginTop: 40,
                marginBottom: 40,
                color: Color.LightGrey,
                textAlign: 'center',
              }}
            >
              {t('goal-view.empty-message')}{' '}
              <PressableOpacity
                hitSlop={10}
                containerStyle={{
                  transform: [
                    { translateY: Platform.select({ ios: 4, default: 6 }) },
                  ],
                }}
                onPress={() =>
                  // StoriesService.show(
                  //   transformStoryGroupSource(goalListStoryGroup).stories
                  // )
                  StoriesService.show(
                    transformStoryGroupSource(breakGoalsDownStoryGroup).stories
                  )
                }
              >
                <Icon name="info" style={{ tintColor: Color.LightGrey }} />
              </PressableOpacity>
            </Text>
          </View>
          <Animated.View key="add">
            <View style={{ gap: 8 }}>
              <AddButton
                title={t('goal-view.add-task')}
                onPress={() => setInputEnabled(true)}
              />
              <AIButton goal={goal} />
            </View>
          </Animated.View>
        </>
      )}

      {inactiveTasks.length > 0 && (
        <>
          <Animated.View style={{ marginTop: 8, paddingVertical: 16 }}>
            <Text style={{ color: Color.LightGrey }}>
              {t('completed-tasks')}
            </Text>
          </Animated.View>
          <Surface
            style={{
              padding: 0,
              backgroundColor: Color.Black,
              borderWidth: 1,
              borderColor: Color.Grey,
            }}
          >
            {inactiveTasks.map((t, i) => {
              return (
                <View key={t.id}>
                  {i > 0 && <Divider />}
                  <TaskItem task={t} />
                </View>
              )
            })}
          </Surface>
        </>
      )}
    </KeyboardAvoidingScrollView>
  )
}
const ActionButton = ({ icon, style, onPress }) => {
  return (
    <PressableOpacity
      containerStyle={[
        {
          marginLeft: 8,
          alignSelf: 'flex-end',
          marginBottom: 10,
        },
        style,
      ]}
      onPress={onPress}
    >
      {icon}
    </PressableOpacity>
  )
}

const TaskItem = ({ task }: { task: Task }) => {
  const realm = useRealm()
  const moment = useMoment()
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [inputText, setInputText] = useState(task.name)

  const faded = false
  const completed = !task.active

  const onSave = () => {
    const name = inputText.trim()
    if (name && name !== task.name) {
      realm.write(() => {
        new TaskRepository(realm).upsert(task.id, {
          name: name,
          goal: task.goal[0],
        })
      })
    } else {
      onCancel()
    }

    setEditing(false)
  }
  const onCancel = () => {
    setInputText(task.name)
    setEditing(false)
  }

  const getNextActiveDay = () => {
    const type = task.repeatOptions?.type
    const today = moment(task.startDate)
    const endDate = moment(task.endDate)

    if (type === RepeatOption.Day) {
      const currentDayIndex = (today.day() + 6) % 7
      const weekLength = task.repeatOptions?.daysOfWeek?.length

      for (let i = 0; i < weekLength; i++) {
        const nextDayIndex = (currentDayIndex + i) % weekLength
        const nextDate = today.clone().add(i, 'days')

        if (
          task.repeatOptions?.daysOfWeek?.[nextDayIndex] &&
          nextDate.isBefore(endDate) &&
          !nextDate.isSame(today)
        ) {
          return today.clone().add(i, 'days').format(DATE_FORMAT)
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

          if (nextActiveDay.isBefore(endDate)) {
            break
          } else {
            nextActiveDay = null
          }
        }
      }

      if (!nextActiveDay && isLastDayOfMonth) {
        nextActiveDay = today.clone().endOf('month').startOf('day')

        if (nextActiveDay.isAfter(endDate) || nextActiveDay.isSame(today)) {
          nextActiveDay = null
        }
      }

      if (!nextActiveDay) {
        const nextMonth = today.clone().add(1, 'month')

        for (let day of activeDays) {
          if (day < nextMonth.daysInMonth()) {
            nextActiveDay = moment(nextMonth).date(day)

            if (nextActiveDay.isBefore(endDate)) {
              break
            } else {
              nextActiveDay = null
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
        if (dateOfYear.isBefore(endDate)) {
          return dateOfYear.format(DATE_FORMAT)
        }
      } else {
        if (nextYearDate.isBefore(endDate) && !nextYearDate.isSame(today)) {
          return nextYearDate.format(DATE_FORMAT)
        }
      }

      return null
    }
  }

  const toggleTask = () => {
    if (task.startDate) {
      taskCountByDate.clear()
    }

    const taskDeadline = task.endTime
      ? moment(`${task.startDate}T${task.endTime}`)
      : null
    const now = moment()
    const delayMin = task.endTime ? now.diff(taskDeadline, 'minutes') : 0

    if (!task.repeatOptions?.type) {
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
        const nextActiveDay = getNextActiveDay()

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
              parentId: task.parentId ?? task.id,
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
        }
      }
    }
  }

  const isOverdue =
    task.startDate &&
    moment().isAfter(
      dayTimeToDate(task.startDate, task.endTime ?? '23:59:59'),
      'seconds'
    )

  return (
    <View style={{}}>
      {editing ? (
        <TaskAdding
          value={inputText}
          setValue={t => setInputText(t)}
          onSave={onSave}
          onCancel={onCancel}
        />
      ) : (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: 12,
            }}
          >
            <View style={{ flex: 1, paddingVertical: 10 }}>
              <Checkbox
                label={task.name}
                checked={completed}
                style={{ paddingLeft: 12, flex: 1 }}
                onCheck={toggleTask}
              />
            </View>
            <TaskMenu task={task} onEdit={() => setEditing(true)} />
          </View>

          {!!task.startDate && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 10,
                paddingHorizontal: 12,
              }}
            >
              {completed ? (
                <Text
                  style={{
                    color: Color.LightGrey,
                    textDecorationLine: 'line-through',
                  }}
                >
                  {t('completed')}
                </Text>
              ) : isOverdue ? (
                <Text style={{ color: Color.AccentRed }}>{t('overdue')}</Text>
              ) : (
                <Text style={{ color: Color.LightGrey }}>{t('scheduled')}</Text>
              )}
              <Text
                style={[
                  {
                    color: completed
                      ? Color.LightGrey
                      : isOverdue
                      ? Color.AccentRed
                      : Color.LightGrey,
                  },
                  completed && { textDecorationLine: 'line-through' },
                ]}
              >
                {moment(task.startDate).format('LL')}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const TaskAdding = ({ value, setValue, onSave, onCancel }) => {
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus?.()
  }, [])

  return (
    <View
      style={{
        flexDirection: 'row',
        // alignItems: 'center',
        paddingLeft: 12,
      }}
    >
      <Icon
        name="checkbox-unchecked"
        style={[
          { tintColor: Color.LightGrey },
          Platform.select({
            ios: { marginTop: 10 },
            default: { marginTop: 10 },
          }),
        ]}
      />
      <TextInput
        ref={inputRef}
        value={value}
        onBlur={onSave}
        // textAlignVertical="top"
        multiline
        onChangeText={t => setValue(t)}
        maxLength={inputLengthLimits.taskName}
        style={[
          { flex: 1, maxHeight: 80, paddingLeft: 8 },
          Platform.select({
            ios: { padding: 0, paddingBottom: 12, paddingTop: 8 },
            default: { paddingVertical: 6.2 },
          }),
        ]}
      />

      <ActionButton
        icon={<Icon name="close" style={{ tintColor: Color.AccentRed }} />}
        onPress={onCancel}
      />
      <ActionButton
        icon={<Icon name="check" style={{ tintColor: Color.AccentBlue }} />}
        style={{ paddingRight: 16 }}
        onPress={() => inputRef.current.blur()}
      />
    </View>
  )
}

const TaskMenu = ({ task, onEdit }: { task: Task; onEdit?: () => void }) => {
  const isSubscribed = useSelector(s => s.iap.isSubscribed)
  const realm = useRealm()
  const { t } = useTranslation()
  const [menuOpened, setMenuOpened] = useState(false)

  const openMenu = () => setMenuOpened(true)
  const closeMenu = () => setMenuOpened(false)

  const planHandler = () => {
    closeMenu()

    if (isSubscribed) {
      navigationStore.taskFormRef.current.open({
        taskId: task.id,
        isPlan: true,
      })
    } else {
      SubscriptionService.openSubscriptionSheet({ variant: 3 })
    }
  }
  const editHandler = () => {
    closeMenu()

    if (task.startDate) {
      navigationStore.taskFormRef.current.open({ taskId: task.id })
    } else {
      onEdit()
    }
  }

  const hiddenTasks = useQuery(Task).filter(tsk => tsk.hidden)

  const deleteHandler = () => {
    closeMenu()
    taskCountByDate.clear()
    if (task.repeatOptions?.type) {
      hiddenTasks.forEach(hiddenTask => {
        if (hiddenTask.parentId === task._id.toString()) {
          realm.write(() => {
            crashlytics().log('task delete at TaskItem')
            new TaskRepository(realm).delete(hiddenTask)
          })
        }
      })
    }
    realm.write(() => {
      crashlytics().log('task delete at TaskItem')
      new TaskRepository(realm).delete(task)
    })
  }

  return (
    <Menu
      visible={menuOpened}
      onDismiss={closeMenu}
      anchor={
        <PressableOpacity hitSlop={20} onPress={openMenu}>
          <Icon
            name="triple-dot"
            style={[
              { tintColor: Color.LightGrey },
              menuOpened && { tintColor: Color.AccentBlue },
            ]}
          />
        </PressableOpacity>
      }
      anchorPosition="bottom"
    >
      {task.isValid() && !task.startDate && (
        <Menu.Item
          title={t('action.schedule')}
          leadingIcon={{
            source: IconSource.clock,
            direction: 'ltr',
          }}
          style={{ width: isSubscribed ? 'auto' : 216 }}
          trailingIcon={isSubscribed ? {} : BoostIcon}
          onPress={planHandler}
        />
      )}
      <Menu.Item
        title={t('action.edit')}
        leadingIcon={{ source: IconSource.edit, direction: 'ltr' }}
        onPress={editHandler}
      />
      <Menu.Item
        title={t('action.delete')}
        titleStyle={{ color: Color.AccentRed }}
        leadingIcon={TrashMenuIcon}
        onPress={deleteHandler}
      />
    </Menu>
  )
}

export default forwardRef(CategorySheet)
