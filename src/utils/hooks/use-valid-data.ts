import { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import { getUniqueId } from 'react-native-device-info'
import { UserApi } from '~/api/user-api'
import { useQuery } from '~/db'
import { Category } from '~/db/models/category'
import { Goal } from '~/db/models/goal'
import { Task } from '~/db/models/task'
import installations from '~/services/firebase/installations'

export const useValidData = () => {
  const timeoutRef = useRef(null)

  const categories = useQuery(Category)
  const formatedCategories = Array.from(categories)
  const goals = useQuery(Goal)
  const formatedGoals = Array.from(goals)
  const tasks = useQuery(Task)
  const formatedTasks = Array.from(tasks)

  const copyCategories = formatedCategories?.map(
    ({ _id, name, createdAt, updatedAt }) => {
      return {
        _id,
        name,
        createdAt,
        updatedAt,
      }
    }
  )

  const copyGoals = formatedGoals?.map(
    ({ _id, name, deadline, active, createdAt, updatedAt, category }) => {
      const resGoal = {
        _id,
        name,
        deadline,
        active,
        createdAt,
        updatedAt,
      }

      if (category) {
        resGoal.categoryId = category[0]._id
      }

      return resGoal
    }
  )

  const copyTasks = formatedTasks.map(
    ({
      _id,
      name,
      text,
      active,
      startDate,
      endDate,
      startTime,
      endTime,
      typeId,
      priorityId,
      notificationTime,
      notificationDate,
      createdAt,
      updatedAt,
      goal,
      repeatOptions,
      parentId,
      hidden,
    }) => {
      const resTask = {
        _id,
        name,
        text,
        active,
        startDate,
        endDate,
        startTime,
        endTime,
        typeId,
        priorityId,
        notificationTime,
        notificationDate,
        createdAt,
        updatedAt,
        repeatOptions,
        parentId,
        hidden,
      }

      if (goal[0]) {
        resTask.goalId = goal[0]._id
      }

      return resTask
    }
  )

  const data = {
    categories: copyCategories,
    goals: copyGoals,
    tasks: copyTasks,
  }

  useEffect(() => {
    const sendValidData = async () => {
      // const reqData = {
      //   externalId: await Platform.select({
      //     ios: () => getUniqueId(),
      //     default: () => installations().getId(),
      //   })(),
      //   ...data,
      // }
      const reqData = {
        externalId: await installations().getId(),
        ...data,
      }
      await UserApi.saveData(reqData)
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      sendValidData()
    }, 2000)

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [categories, goals, tasks])

  return data
}
