import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import CalendarPanel from '~/components/screens/tasks-screen/CalendarPanel.tsx'
import moment from 'moment'
import { CalendarContext } from '~/components/screens/tasks-screen/calendar-context.ts'
import { W_H_PADDING } from '~/styles'
import Text from '~/components/ui/text/Text.tsx'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity.tsx'
import Icon from '~/components/ui/icons/Icon.tsx'
import { View } from 'react-native'
import TasksSettings from '~/components/screens/tasks-screen/TasksSettings.tsx'

const TasksHeader: React.ForwardRefRenderFunction<any, {}> = (
  {},
  componentRef
) => {
  const [monthYear, setMonthYear] = useState(moment())
  const [showScrollToStartButton, setShowScrollToStartButton] = useState(false)
  const [calendarMode, setCalendarMode] = useState('weekly')

  const panelRef = useRef(null)

  const contextValue = useMemo(
    () => ({
      calendarMode,
      setCalendarMode,

      monthYear,
      setMonthYear,

      showScrollToStartButton,
      setShowScrollToStartButton,
    }),
    [
      calendarMode,
      setCalendarMode,
      monthYear,
      setMonthYear,
      showScrollToStartButton,
      setShowScrollToStartButton,
    ]
  )

  useImperativeHandle(componentRef, () => ({
    scrollToStart: () => panelRef.current.scrollToStart(),
    scrollToStartMonth: () => panelRef.current.scrollToStartMonth(),
  }))

  const homePressHandler = () => {
    if (calendarMode === 'weekly') {
      panelRef.current.scrollToStart()
    } else {
      panelRef.current.scrollToStartMonth()
    }
  }

  return (
    <CalendarContext.Provider value={contextValue}>
      <View>
        <View
          style={{
            paddingVertical: 16,
            paddingHorizontal: W_H_PADDING,
            flexDirection: 'row',
          }}
        >
          <Text style={{ textTransform: 'capitalize', marginRight: 'auto' }}>
            {monthYear.format('MMMM YYYY')}
          </Text>
          {showScrollToStartButton && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={{ marginRight: 16 }}
            >
              <PressableOpacity hitSlop={15} onPress={homePressHandler}>
                <Icon name="home" />
              </PressableOpacity>
            </Animated.View>
          )}

          <View>
            <TasksSettings />
          </View>
        </View>

        <CalendarPanel ref={panelRef} />
      </View>
    </CalendarContext.Provider>
  )
}

export default forwardRef(TasksHeader)
