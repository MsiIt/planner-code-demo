import { useSelector } from '~/store/utils'
import { useQuery } from '~/db'
import { Goal } from '~/db/models/goal'
import { Task } from '~/db/models/task'
import { TaskType } from '~/constants'
import { groupBy } from 'lodash'
import moment from 'moment'

export const useUserAnalyticsProps = () => {
  const goals = useQuery(Goal)
  const tasks = useQuery(Task).filter(
    task => task.typeId !== TaskType.Custom && !task.active
  )

  const getGoalsLengthBucket = (length: number): string => {
    if (length === 0) {
      return '0'
    } else if (length <= 3) {
      return '1-3'
    } else if (length <= 7) {
      return '4-7'
    } else {
      return '8+'
    }
  }

  const isSubscribed = useSelector(s => s.iap.isSubscribed)

  const getStreakBucket = (value: number): string =>
    value < 30 ? String(value) : '30+'

  const groupedByType = groupBy(tasks, task => task.typeId)

  const calculateMaxStreak = (tasksForType: Task[]): number => {
    const dates = tasksForType.map(task => task.startDate)

    const sortedDates = dates
      .map(dateStr => moment(dateStr))
      .sort((a, b) => a.diff(b))

    let maxStreak = 0
    let currentStreak = 0
    let prevDate: moment.Moment | null = null

    for (const date of sortedDates) {
      if (prevDate) {
        const diff = date.diff(prevDate, 'days')
        if (diff === 1) {
          currentStreak++
        } else {
          currentStreak = 1
        }
      } else {
        currentStreak = 1
      }
      prevDate = date
      maxStreak = Math.max(maxStreak, currentStreak)
    }

    return maxStreak
  }

  const maxStreakAcrossTypes = Math.max(
    calculateMaxStreak(groupedByType[TaskType.Gratitude] || []),
    calculateMaxStreak(groupedByType[TaskType.GoalReading] || []),
    calculateMaxStreak(groupedByType[TaskType.DayAnalysis] || []),
    calculateMaxStreak(groupedByType[TaskType.Achievement] || [])
  )

  return {
    user_segment: 'organics',
    premium_status: isSubscribed ? '1' : '0',
    goals_created: getGoalsLengthBucket(goals.length),
    autotask_streak: getStreakBucket(maxStreakAcrossTypes),
  }
}
