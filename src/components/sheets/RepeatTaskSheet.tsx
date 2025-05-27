import React, { forwardRef, useContext, useEffect, useMemo } from 'react'
import BottomSheetModal from '../ui/bottom-sheet/BottomSheetModal'
import { View } from 'react-native'
import { W_H_PADDING } from '~/styles'
import Button from '../ui/buttons/Button'
import { Color } from '~/styles/color'
import { DATE_FORMAT, RepeatOption } from '~/constants'
import Text from '../ui/text/Text'
import PressableOpacity from '../ui/pressable/PressableOpacity'
import Icon from '../ui/icons/Icon'
import { useTranslation } from 'react-i18next'
import { taskFromContext } from '../forms/task/task-form-context'
import { useMoment } from '~/modules/hooks/use-moment'
import DateField from '../ui/fields/DateField'
import { navigationStore } from '~/navigation/navigation-store'
import { Image } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const RepeatTaskSheet = ({}, ref) => {
  const { t } = useTranslation()
  const moment = useMoment()

  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const dayLabel = moment()
      .day(index + 1)
      .format('dddd')
    return {
      id: index + 1,
      label: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1),
    }
  })

  const monthDays = Array.from({ length: 31 }, (_, index) => index + 1)

  const {
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
  } = useContext(taskFromContext)

  const repeatSnapPoints = useMemo(() => ['93%'], [])
  const closeRepeatSheet = () => ref.current?.close()
  const keyboard = useReanimatedKeyboardAnimation()
  const insets = useSafeAreaInsets()

  const actionsContainerStyle = useAnimatedStyle(
    () => ({
      bottom:
        (-keyboard.height.value - insets.bottom) * keyboard.progress.value,
    }),
    [insets.bottom]
  )

  const isSelectedOption = o => o === repeatType

  const handleSelectDay = v => {
    const updatedDays = [...days]
    updatedDays[v] = !updatedDays[v]
    setDays(updatedDays)
  }

  const isSelectedDayOfMonth = d => daysOfMonth?.find(day => day === d)

  const handleSelectDayOfMonth = d => {
    if (isSelectedDayOfMonth(d)) {
      setDaysOfMonth(daysOfMonth.filter(day => day !== d))
    } else {
      setDaysOfMonth([...daysOfMonth, d])
    }
  }

  const currentDate = moment()
  const lastDate = currentDate.clone().subtract(5, 'months').startOf('month')
  const nextDate = currentDate.clone().add(6, 'months').endOf('month')

  const cancel = () => {
    closeRepeatSheet()
    setDays(new Array(7).fill(false))
    setDaysOfMonth([])
    setDateOfYear(navigationStore.taskScreenDate.format(DATE_FORMAT))
    setRepeatType(RepeatOption.Day)
  }

  const submit = () => {
    let repeatOption = {}

    if (repeatType === RepeatOption.Day) {
      if (days.some(d => d !== false)) {
        repeatOption.daysOfWeek = days
      }
    } else if (repeatType === RepeatOption.Month) {
      if (daysOfMonth?.length !== 0) {
        const sortedDays = [...daysOfMonth].sort((a, b) => a - b)
        repeatOption.daysOfMonth = sortedDays
      } else {
        repeatOption.daysOfMonth = []
      }
      repeatOption.isLastDayOfMonth = isLastDayOfMonth
    } else if (repeatType === RepeatOption.Year) {
      repeatOption.dateOfYear = dateOfYear
    }

    repeatOption.type = repeatType

    if (
      days.every(d => d === false) &&
      daysOfMonth.length === 0 &&
      !isLastDayOfMonth &&
      repeatType !== RepeatOption.Year
    ) {
      repeatOption = null
    }

    setRepeatOptions(repeatOption)

    closeRepeatSheet()
  }

  // useEffect(() => {
  //   console.log({ repeatOptions })
  // }, [repeatOptions])

  const renderDays = () => {
    const rows = []
    for (let i = 0; i < monthDays.length; i += 7) {
      rows.push(monthDays.slice(i, i + 7))
    }

    return rows.map((week, index) => {
      return (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'space-between',
          }}
        >
          {week.map(day => {
            return (
              <PressableOpacity
                style={{
                  width: 45,
                  height: 45,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelectedDayOfMonth(day)
                    ? Color.AccentBlue
                    : Color.Dark,
                  borderRadius: 8,
                }}
                key={day}
                onPress={() => handleSelectDayOfMonth(day)}
              >
                <Text>{day.toString()}</Text>
              </PressableOpacity>
            )
          })}
          {index === 4 && (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}
            >
              <PressableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  // paddingHorizontal: 29,
                  backgroundColor: isLastDayOfMonth
                    ? Color.AccentBlue
                    : Color.Dark,
                  borderRadius: 8,
                  display: 'flex',
                  flex: 1,
                }}
                containerStyle={{ width: '100%' }}
                onPress={() => setIsLastDayOfMonth(!isLastDayOfMonth)}
              >
                <Text style={{ fontSize: 12.5 }}>
                  {t('repeat-options.sheet.last-day-of-month')}
                </Text>
              </PressableOpacity>
            </View>
          )}
        </View>
      )
    })
  }

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={repeatSnapPoints}
      stackBehavior="push"
      onBackdropPress={closeRepeatSheet}
    >
      <View
        style={{
          paddingHorizontal: W_H_PADDING,
          flex: 1,
        }}
      >
        <View
          style={{
            height: 52,
            justifyContent: 'center',
          }}
        >
          <Text style={{ textAlign: 'center' }}>
            {t('repeat-options.title')}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginBottom: 8,
          }}
        >
          <TabButton
            title={t('repeat-options.tab.day')}
            selected={isSelectedOption(RepeatOption.Day)}
            onPress={() => setRepeatType(RepeatOption.Day)}
          />
          <TabButton
            title={t('repeat-options.tab.month')}
            selected={isSelectedOption(RepeatOption.Month)}
            onPress={() => setRepeatType(RepeatOption.Month)}
          />
          <TabButton
            title={t('repeat-options.tab.year')}
            selected={isSelectedOption(RepeatOption.Year)}
            onPress={() => setRepeatType(RepeatOption.Year)}
          />
        </View>

        {repeatType === RepeatOption.Day && (
          <>
            <View
              style={{
                marginTop: 6,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Text style={{ color: Color.LightGrey }}>
                {t('repeat-options.description.day')}
              </Text>
              {/* <PressableOpacity>
                <Icon
                  name="info"
                  size={20}
                  style={{ tintColor: Color.LightGrey }}
                />
              </PressableOpacity> */}
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              {weekDays.map((weekday, i) => {
                return (
                  <View key={weekday.id}>
                    <DayCheckbox
                      label={weekday.label}
                      onCheck={() => handleSelectDay(i)}
                      style={{
                        padding: 12,
                        backgroundColor: Color.Dark,
                        borderRadius: 8,
                      }}
                      checked={days[i]}
                    />
                  </View>
                )
              })}
            </View>
          </>
        )}

        {repeatType === RepeatOption.Month && (
          <>
            <View
              style={{
                marginTop: 6,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingRight: 60,
              }}
            >
              <Text style={{ color: Color.LightGrey }}>
                {t('repeat-options.description.month')}
                {/* <PressableOpacity style={{ overflow: 'visible' }}>
                  <Image
                    source={require('~assets/icons/info.png')}
                    style={{
                      top: 5,
                      left: 4,
                      width: 20,
                      height: 20,
                    }}
                  />
                </PressableOpacity> */}
              </Text>
            </View>
            <View style={{ gap: 8, width: '100%' }}>{renderDays()}</View>
          </>
        )}

        {repeatType === RepeatOption.Year && (
          <>
            <View
              style={{
                marginTop: 6,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Text style={{ color: Color.LightGrey }}>
                {t('repeat-options.description.year')}
                {/* <PressableOpacity style={{ overflow: 'visible' }}>
                  <Image
                    source={require('~assets/icons/info.png')}
                    style={{
                      top: 5,
                      left: 4,
                      width: 20,
                      height: 20,
                    }}
                  />
                </PressableOpacity> */}
              </Text>
            </View>
            <View style={{ marginTop: 16 }}>
              <DateField
                date={dateOfYear}
                dateFormat={'D MMMM'}
                placeholder={t('task-form.placeholder.date')}
                onDateChange={d => setDateOfYear(d)}
                // additionalOptions={{
                //   minimumDate: lastDate.toDate(),
                //   maximumDate: nextDate.toDate(),
                // }}
              />
            </View>
          </>
        )}

        <Animated.View
          style={[
            actionsContainerStyle,
            {
              flexDirection: 'row',
              marginTop: 'auto',
              paddingVertical: 10,
              backgroundColor: Color.Black,
              paddingBottom: 10 + insets.bottom,
            },
          ]}
        >
          <Button
            title={t('cancel')}
            containerStyle={{ flex: 1 }}
            onPress={cancel}
          />
          <Button
            title={t('repeat-options.button.complete')}
            containerStyle={{ marginLeft: 16, flex: 1 }}
            style={{ backgroundColor: Color.AccentBlue }}
            onPress={submit}
          />
        </Animated.View>
      </View>
    </BottomSheetModal>
  )
}

const TabButton = ({ title, selected, onPress }) => {
  const { t } = useTranslation()

  return (
    <View style={{ flex: 1 }}>
      <Button
        title={title}
        titleStyle={{ fontWeight: '400', fontSize: 12, lineHeight: 16 }}
        style={{
          backgroundColor: selected ? Color.AccentBlue : Color.Grey,
          borderWidth: 0,
          padding: 8,
          borderTopLeftRadius: title === t('repeat-options.tab.day') ? 8 : 0,
          borderBottomLeftRadius: title === t('repeat-options.tab.day') ? 8 : 0,
          borderTopRightRadius: title === t('repeat-options.tab.year') ? 8 : 0,
          borderBottomRightRadius:
            title === t('repeat-options.tab.year') ? 8 : 0,
          borderLeftWidth: title === t('repeat-options.tab.month') ? 1 : 0,
          borderRightWidth: title === t('repeat-options.tab.month') ? 1 : 0,
          borderColor: selected ? Color.AccentBlue : Color.LightGrey,
        }}
        onPress={onPress}
      />
    </View>
  )
}

const DayCheckbox = ({
  label,
  checked = false,
  style = {},
  labelStyle = {},
  onCheck,
}) => {
  return (
    <PressableOpacity
      style={[{ flexDirection: 'row' }, style]}
      onPress={onCheck}
      disabled={!onCheck}
      containerStyle={{ zIndex: 2 }}
    >
      <Text style={[{ flex: 1 }, labelStyle]} numberOfLines={3}>
        {label}
      </Text>
      <Icon
        name={checked ? 'checkbox-checked' : 'checkbox-unchecked'}
        style={{ tintColor: !checked ? Color.LightGrey : Color.AccentBlue }}
      />
    </PressableOpacity>
  )
}

export default forwardRef(RepeatTaskSheet)
