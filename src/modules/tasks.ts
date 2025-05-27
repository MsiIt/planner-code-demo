import { DATE_FORMAT, RepeatOption, TaskType } from '~/constants'

export const calculateTaskCount = (d, tasksSettings, moment) => {
  const day = d.format(DATE_FORMAT)
  let count = tasksSettings?.tasksByDate?.[day]?.length ?? 0

  for (const task of tasksSettings?.masterTasks) {
    // if (!task.active || task.typeId !== TaskType.Custom) {
    //   continue
    // }

    // if (task.hidden) {
    //   continue
    // }

    if (tasksSettings?.result?.[task.id]?.hiddenDates?.has(day)) {
      continue
    }

    if (task.startDate === day) {
      count++
      continue
    }

    const repeatType = task.repeatOptions?.type
    if (!repeatType) {
      continue
    }

    const endDate = moment(task.endDate)
    const isEndDateExist = !!task.endDate
    const isAfterStartDate = moment(task.startDate) < d

    if (repeatType === RepeatOption.Day) {
      const daysOfWeek = task.repeatOptions?.daysOfWeek
      const currentWeekday = (d.day() + 6) % 7

      if (!isEndDateExist) {
        if (daysOfWeek?.[currentWeekday] === true && isAfterStartDate) {
          count++
          continue
        } else {
          continue
        }
      } else {
        const isEndDateAfterCurrentDay = endDate.isAfter(d) || endDate.isSame(d)

        if (
          daysOfWeek?.[currentWeekday] === true &&
          isEndDateAfterCurrentDay &&
          isAfterStartDate
        ) {
          count++
          continue
        } else {
          continue
        }
      }
    }

    if (repeatType === RepeatOption.Month) {
      const currentDay = tasksSettings?.result?.[task.id]?.repeatDays?.has(
        d.date()
      )
      const isLastDayOfMonth = task.repeatOptions?.isLastDayOfMonth
      const isDayLastOfMonth = moment(day).isSame(
        moment(day).endOf('month'),
        'day'
      )

      if (!isEndDateExist) {
        if (
          (currentDay || (isLastDayOfMonth && isDayLastOfMonth)) &&
          isAfterStartDate
        ) {
          count++
          continue
        } else {
          continue
        }
      } else {
        const isEndDateAfterCurrentDay = endDate.isAfter(d) || endDate.isSame(d)

        if (
          (currentDay || (isLastDayOfMonth && isDayLastOfMonth)) &&
          isEndDateAfterCurrentDay &&
          isAfterStartDate
        ) {
          count++
          continue
        } else {
          continue
        }
      }
    }

    if (repeatType === RepeatOption.Year) {
      const currentDay = d.date()
      const dateOfYear = moment(task.repeatOptions?.dateOfYear)
      const currentMonth = d.month() + 1

      if (!isEndDateExist) {
        if (
          dateOfYear.month() + 1 === currentMonth &&
          dateOfYear.date() === currentDay &&
          isAfterStartDate
        ) {
          count++
          continue
        } else {
          continue
        }
      } else {
        const isEndDateAfterCurrentDay = endDate.isAfter(d) || endDate.isSame(d)

        if (
          isEndDateAfterCurrentDay &&
          dateOfYear.month() + 1 === currentMonth &&
          dateOfYear.date() === currentDay &&
          isAfterStartDate
        ) {
          count++
          continue
        } else {
          continue
        }
      }
    }
  }
  return count
}

export const taskCountByDate: Map<string, number> = new Map()
