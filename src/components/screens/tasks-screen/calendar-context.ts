import { createContext } from 'react'
import { Moment } from 'moment/moment'

export const CalendarContext = createContext<{
  calendarMode
  setCalendarMode
  monthYear
  setMonthYear
  showScrollToStartButton
  setShowScrollToStartButton

  date: Moment
  onDatePress: (date: Moment) => void
}>(null!)
