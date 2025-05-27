import React, { useEffect, useRef } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { defaultScreenOptions } from './utils'
import TabNavigator from './TabNavigator'
import { ScreenName } from '~/constants/navigation'
import ReaderScreen from '~/screens/ReaderScreen'
import InfoUpdateService from '~/components/cloud-service/InfoUpdateService'
import AiTasksModal from '~/components/modals/AiTasksModal.tsx'
import { useValidData } from '~/utils/hooks/use-valid-data'
import { useAppState } from '@react-native-community/hooks'
import { useMoment } from '~/modules/hooks/use-moment'
import { useRealm } from '~/db'
import { DATE_FORMAT } from '~/constants'
import { TaskRescheduler } from '~/modules/task-rescheduler'
import { AutotasksModule } from '~/modules/autotasks'
import { FirebaseUserService } from '~/components/firebase-service'

const CloudDataService = () => {
  useValidData()
  return null
}

const AppStateService = () => {
  // логика при открывании аппки на след. день из свёрнутого состояния
  const appState = useAppState()
  const moment = useMoment()
  const realm = useRealm()
  const lastTodayDateRef = useRef(moment().format(DATE_FORMAT))
  useEffect(() => {
    if (
      appState === 'active' &&
      lastTodayDateRef.current !== moment().format(DATE_FORMAT)
    ) {
      // по-хорошему, лучше перенести в другое место, хотя и тут норм
      realm.write(() => {
        new TaskRescheduler(realm).process().catch(() => 0)
        new AutotasksModule(realm).process().catch(() => 0)
      })
    }

    lastTodayDateRef.current = moment().format(DATE_FORMAT)
  }, [moment, appState])
  return null
}

const MainStack = createStackNavigator()
export default function MainNavigator() {
  return (
    <>
      <AppStateService />
      <InfoUpdateService />
      <AiTasksModal />
      <CloudDataService />
      <FirebaseUserService />

      <MainStack.Navigator
        initialRouteName={ScreenName.TabNavigator}
        screenOptions={{ ...defaultScreenOptions }}
      >
        {/* tabs */}
        <MainStack.Screen
          name={ScreenName.TabNavigator}
          component={TabNavigator}
        />

        <MainStack.Screen name={ScreenName.Reader} component={ReaderScreen} />
      </MainStack.Navigator>
    </>
  )
}
