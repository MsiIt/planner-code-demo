import React, { useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Text from '~/components/ui/text/Text'
import { Platform, View } from 'react-native'
import TextField from '../../ui/fields/TextField'
import GoalSelector from '../../selectors/GoalSelector'
import DateField from '../../ui/fields/DateField'
import RadioButton from '../../ui/buttons/RadioButton'
import { Color } from '~/styles/color'
import PressableOpacity from '../../ui/pressable/PressableOpacity'
import Icon from '../../ui/icons/Icon'
import Surface from '../../ui/surface/Surface'
import Button from '../../ui/buttons/Button'
import { DATE_FORMAT, Priority, RepeatOption } from '~/constants'
import { taskFromContext } from './task-form-context'
import Animated, { FlipInEasyX } from 'react-native-reanimated'
import TimeField from '~/components/ui/fields/TimeField'
import SwitchButton from '~/components/ui/buttons/SwitchButton'
import { StoriesService } from '~/components/stories-service'
import { inputLengthLimits } from '~/constants/inputs'
import { useSelector } from '~/store/utils'
import { SubscriptionService } from '~/components/subscription-service'
import { transformStoryGroupSource } from '~/modules/knowledge'
import { eisenhowerStoryGroup } from '~assets/data/ai-stories'
import { Toast } from '~/modules/toast'
import { BSModal } from '~/components/ui/bottom-sheet/BottomSheetModal'
import RepeatTaskSheet from '~/components/sheets/RepeatTaskSheet'
import { navigationStore } from '~/navigation/navigation-store'
import { useMoment } from '~/modules/hooks/use-moment'
import { FontFamily } from '~/styles/typography'
import { Image } from 'react-native'

const TaskForm: React.FC = () => {
  const isSubscribed = useSelector(s => s.iap.isSubscribed)
  const moment = useMoment()
  const { t } = useTranslation()
  const {
    isEdit,

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
    notificationTime,
    setNotificationTime,
    notificationDate,
    setNotificationDate,

    setRepeatType,
    setDays,
    setDaysOfMonth,
    setIsLastDayOfMonth,
    setDateOfYear,

    repeatOptions,

    stopRepeatDate,
    setStopRepeatDate,

    currentDay,
    setCurrentDay,
    minimumDate,
    taskId,
    isPlan,

    showErrors,
  } = useContext(taskFromContext)

  const repeatRef = useRef<BSModal>()
  const openRepeatSheet = () => {
    setRepeatType(repeatOptions?.type ?? RepeatOption.Day)

    if (repeatOptions?.type === RepeatOption.Day) {
      setDays(repeatOptions?.daysOfWeek)
    } else {
      setDays(new Array(7).fill(false))
    }

    if (repeatOptions?.type === RepeatOption.Month) {
      setDaysOfMonth(repeatOptions?.daysOfMonth)
      setIsLastDayOfMonth(repeatOptions?.isLastDayOfMonth)
    } else {
      setDaysOfMonth([])
      setIsLastDayOfMonth(false)
    }

    if (repeatOptions?.type === RepeatOption.Year) {
      setDateOfYear(repeatOptions?.dateOfYear)
    } else {
      setDateOfYear(navigationStore.taskScreenDate.format(DATE_FORMAT))
    }
    repeatRef.current?.present()
  }

  const currentRepeatOption =
    repeatOptions?.type === RepeatOption.Day
      ? t('repeat.type.weekly')
      : repeatOptions?.type === RepeatOption.Month
      ? t('repeat.type.monthly')
      : repeatOptions?.type === RepeatOption.Year
      ? t('repeat.type.annual')
      : ''

  const isSelectedPriority = (p: Priority) => p === priority
  const getPriorityPressHandler = (p?: Priority) => () => {
    if (p === priority) {
      return
    }

    // if (isSubscribed) {
    setPriority(p)
    // } else {
    // SubscriptionService.openSubscriptionSheet({ variant: 2 })
    // }
  }

  const openMatrixStory = () => {
    StoriesService.show(transformStoryGroupSource(eisenhowerStoryGroup).stories)
  }

  const showEisenhowerUnsubscribeModal = () => {
    SubscriptionService.openSubscriptionSheet({ variant: 4 })
  }
  const showRepeatTasksUnsubscribeModal = () => {
    SubscriptionService.openSubscriptionSheet({ variant: 5 })
  }

  return (
    <>
      <Text style={{ textAlign: 'center' }}>
        {isPlan
          ? t('task-form.title.plan')
          : isEdit
          ? t('task-form.title.edit')
          : t('task-form.title.add')}
      </Text>

      <View style={{ marginTop: 16 }}>
        <TextField
          value={name}
          placeholder={t('task-form.placeholder.name')}
          multiline
          textAlignVertical="top"
          error={nameError && showErrors}
          style={{ height: 80 }}
          maxLength={inputLengthLimits.taskName}
          onChangeText={t => setName(t)}
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <GoalSelector
          placeholder={t('task-form.placeholder.goal-relation')}
          goal={goal}
          onSelect={g => setGoal(g)}
        />
      </View>

      <View style={{ marginTop: 16 }}>
        {isPlan && (
          <DateField
            date={date}
            placeholder={t('task-form.placeholder.date')}
            error={dateError && showErrors}
            onDateChange={d => setDate(d)}
          />
        )}
        {!isPlan && (
          <DateField
            date={
              repeatOptions && currentDay !== date && taskId ? currentDay : date
            }
            placeholder={t('task-form.placeholder.date')}
            error={dateError && showErrors}
            onDateChange={d =>
              repeatOptions && currentDay !== date && taskId
                ? setCurrentDay(d)
                : setDate(d)
            }
            additionalOptions={
              repeatOptions && currentDay !== date && taskId
                ? {
                    minimumDate: moment(minimumDate).toDate(),
                  }
                : {}
            }
          />
        )}
      </View>

      <View style={{ marginTop: 16 }}>
        <RadioButton.Group value={isAllDay} onValueChange={v => setIsAllDay(v)}>
          <View style={{ flexDirection: 'row' }}>
            <RadioButton.Item value={true} containerStyle={{ flex: 1 }}>
              <Text numberOfLines={1} style={{ flex: 1 }}>
                {t('task-form.variant.is-all-day')}
              </Text>
            </RadioButton.Item>
            <RadioButton.Item
              value={false}
              containerStyle={{ marginLeft: 16, flex: 1 }}
            >
              <Text numberOfLines={1} style={{ flex: 1 }}>
                {t('task-form.variant.set-time')}
              </Text>
            </RadioButton.Item>
          </View>
        </RadioButton.Group>
      </View>

      {!isAllDay && (
        <Animated.View
          entering={FlipInEasyX}
          style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}
        >
          <View style={{ flex: 1 }}>
            <TimeField
              time={startTime}
              placeholder={t('task-form.placeholder.time.begin')}
              onTimeChange={t => handleStartTimeSet(t)}
            />
          </View>
          <Text style={{ paddingHorizontal: 8 }}>-</Text>
          <View style={{ flex: 1 }}>
            <TimeField
              time={endTime}
              placeholder={t('task-form.placeholder.time.end')}
              onTimeChange={t => handleEndTimeSet(t)}
            />
          </View>
        </Animated.View>
      )}

      <View
        style={{
          marginTop: 16,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: Color.LightGrey }}>
          {t('task-form.title.priority')}
        </Text>
        <PressableOpacity
          containerStyle={{ marginLeft: 4 }}
          onPress={openMatrixStory}
        >
          <Icon name="info" style={{ tintColor: Color.LightGrey }} />
        </PressableOpacity>
        {!isSubscribed && (
          <PressableOpacity
            containerStyle={{ marginLeft: 4 }}
            onPress={showEisenhowerUnsubscribeModal}
          >
            <Image
              source={require('~assets/images/boost-lock.png')}
              style={{ width: 46, height: 12 }}
            />
          </PressableOpacity>
        )}
      </View>

      {!isSubscribed && (
        <PressableOpacity
          onPress={showEisenhowerUnsubscribeModal}
          style={{ opacity: 0.35 }}
        >
          <Surface style={{ padding: 12 }}>
            <View style={{ flexDirection: 'row' }}>
              <PriorityButton
                title={t('priority.not-definded')}
                selected={isSelectedPriority(Priority.NotSpecified)}
                onPress={getPriorityPressHandler(Priority.NotSpecified)}
                disabled
              />
              <PriorityButton
                title={t('priority.main')}
                selected={isSelectedPriority(Priority.Main)}
                onPress={getPriorityPressHandler(Priority.Main)}
                style={{ marginLeft: 12 }}
                disabled
              />
            </View>
            <View style={{ marginTop: 32, flexDirection: 'row' }}>
              <PriorityButton
                title={t('priority.a')}
                name={t('priority.a.desc')}
                selected={isSelectedPriority(Priority.A)}
                onPress={getPriorityPressHandler(Priority.A)}
                disabled
              />
              <PriorityButton
                title={t('priority.b')}
                name={t('priority.b.desc')}
                selected={isSelectedPriority(Priority.B)}
                onPress={getPriorityPressHandler(Priority.B)}
                style={{ marginLeft: 12 }}
                disabled
              />
            </View>
            <View style={{ marginTop: 16, flexDirection: 'row' }}>
              <PriorityButton
                title={t('priority.c')}
                name={t('priority.c.desc')}
                selected={isSelectedPriority(Priority.C)}
                onPress={getPriorityPressHandler(Priority.C)}
                disabled
              />
              <PriorityButton
                title={t('priority.d')}
                name={t('priority.d.desc')}
                selected={isSelectedPriority(Priority.D)}
                onPress={getPriorityPressHandler(Priority.D)}
                style={{ marginLeft: 12 }}
                disabled
              />
            </View>
          </Surface>
        </PressableOpacity>
      )}

      {isSubscribed && (
        <View>
          <Surface style={{ padding: 12 }}>
            <View style={{ flexDirection: 'row' }}>
              <PriorityButton
                title={t('priority.not-definded')}
                selected={isSelectedPriority(Priority.NotSpecified)}
                onPress={getPriorityPressHandler(Priority.NotSpecified)}
              />
              <PriorityButton
                title={t('priority.main')}
                selected={isSelectedPriority(Priority.Main)}
                onPress={getPriorityPressHandler(Priority.Main)}
                style={{ marginLeft: 12 }}
              />
            </View>
            <View style={{ marginTop: 32, flexDirection: 'row' }}>
              <PriorityButton
                title={t('priority.a')}
                name={t('priority.a.desc')}
                selected={isSelectedPriority(Priority.A)}
                onPress={getPriorityPressHandler(Priority.A)}
              />
              <PriorityButton
                title={t('priority.b')}
                name={t('priority.b.desc')}
                selected={isSelectedPriority(Priority.B)}
                onPress={getPriorityPressHandler(Priority.B)}
                style={{ marginLeft: 12 }}
              />
            </View>
            <View style={{ marginTop: 16, flexDirection: 'row' }}>
              <PriorityButton
                title={t('priority.c')}
                name={t('priority.c.desc')}
                selected={isSelectedPriority(Priority.C)}
                onPress={getPriorityPressHandler(Priority.C)}
              />
              <PriorityButton
                title={t('priority.d')}
                name={t('priority.d.desc')}
                selected={isSelectedPriority(Priority.D)}
                onPress={getPriorityPressHandler(Priority.D)}
                style={{ marginLeft: 12 }}
              />
            </View>
          </Surface>
        </View>
      )}

      <View
        style={{
          marginTop: 16,
          height: 44,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Icon name="bell-on" />
        <Text style={{ marginLeft: 8 }}>{t('task-form.notify')}</Text>
        {/* {!!notificationTime && (
          <View style={{ flex: 1, marginHorizontal: 16 }}>
            <TimeField
              time={notificationTime}
              onTimeChange={t => setNotificationTime(t)}
            />
          </View>
        )} */}
        <View style={{ marginLeft: 'auto' }}>
          <SwitchButton
            value={!!notificationTime}
            onChange={v => (v ? enableNotification() : disableNotification())}
          />
        </View>
      </View>
      {!!notificationTime && (
        <View
          style={{
            marginTop: 16,
            height: 44,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <DateField
              date={notificationDate}
              placeholder={t('task-form.placeholder.date')}
              onDateChange={d => setNotificationDate(d)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TimeField
              time={notificationTime}
              onTimeChange={t => setNotificationTime(t)}
              hasIcon
            />
          </View>
        </View>
      )}

      {!isSubscribed && (
        <PressableOpacity
          style={{
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
            // opacity: 0.35,
          }}
          containerStyle={{ paddingVertical: 12 }}
          onPress={showRepeatTasksUnsubscribeModal}
        >
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <View
              style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
            >
              <Icon name="refresh" size={20} />
              <Text>{t('repeat-options.title')}</Text>
            </View>
            <Image
              source={require('~assets/images/boost-lock.png')}
              style={{ width: 46, height: 12 }}
            />
          </View>
          <View
            style={{
              marginLeft: 'auto',
              flexDirection: 'row',
              gap: 8,
              opacity: 0.35,
            }}
          >
            <Text>{currentRepeatOption}</Text>
            <SwitchButton value={!!repeatOptions?.type} disabled />
          </View>
        </PressableOpacity>
      )}

      {isSubscribed && (
        <PressableOpacity
          style={{
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          containerStyle={{ paddingVertical: 12 }}
          onPress={openRepeatSheet}
        >
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <View
              style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
            >
              <Icon name="refresh" size={20} />
              <Text>{t('repeat-options.title')}</Text>
            </View>
          </View>
          <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 8 }}>
            <Text>{currentRepeatOption}</Text>
            <SwitchButton value={!!repeatOptions?.type} disabled />
          </View>
        </PressableOpacity>
      )}

      {repeatOptions && (
        <DateField
          date={stopRepeatDate}
          onDateChange={d => setStopRepeatDate(d)}
          placeholder={''}
          stopRepeatMode
          additionalOptions={{
            minimumDate: moment(date).toDate(),
          }}
        />
      )}

      <View style={{ marginTop: 16 }} />

      <RepeatTaskSheet ref={repeatRef} />
    </>
  )
}

const PriorityButton = ({
  title,
  name,
  selected,
  onPress,
  style,
  disabled,
}) => {
  return (
    <View style={[{ flex: 1 }, style]}>
      <Button
        title={title}
        containerStyle={{ flex: 1 }}
        style={{
          backgroundColor: selected ? Color.AccentBlue : Color.Grey,
          borderWidth: 0,
          padding: 8,
        }}
        onPress={onPress}
        disabled={disabled}
      />
      <Text
        numberOfLines={1}
        style={{
          fontSize: 10,
          lineHeight: 16,
          color: Color.LightGrey,
          textAlign: 'center',
        }}
      >
        {name}
      </Text>
    </View>
  )
}

export default TaskForm
