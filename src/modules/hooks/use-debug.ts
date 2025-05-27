import { useEffect } from 'react'
import reactotron from 'reactotron-react-native'
import { useQuery } from '~/db'
import { Task } from '~/db/models/task'
import notifee from '@notifee/react-native'

const useDebug = () => {
  // reactotron.log(dn)
  // const tasks = useQuery(Task)
  // reactotron.log(tasks)
  // useEffect(() => {
  //   notifee.getTriggerNotifications().then(r => reactotron.log(r))
  // }, [])
}

export default useDebug
