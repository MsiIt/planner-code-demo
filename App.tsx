/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { Platform, StatusBar, UIManager } from 'react-native'
import { Provider } from 'react-redux'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import '~/modules/i18n'
import '~/modules/moment'
import '~/services/firebase'
import 'react-native-get-random-values'
import 'text-encoding-polyfill'

import store from '~/store'
import { AppNavigation } from '~/navigation/AppNavigation'
import { useSelector } from '~/store/utils'
import { AppStatus } from '~/constants'
import { Color } from '~/styles/color'
import LoadingView from '~/components/ui/views/LoadingView'
import { PaperProvider } from 'react-native-paper'
import { RealmProvider } from '~/db'
import { paperTheme } from '~/styles/paper-theme'
import ModalServiceProvider from '~/components/modal-service/ModalServiceProvider'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import StoriesServiceProvider from '~/components/stories-service/StoriesServiceProvider'
import { useNotificationListener } from '~/services/notifications'
import { ToastService } from '~/modules/toast'
import useDebug from '~/modules/hooks/use-debug'
import SubscriptionServiceProvider from '~/components/subscription-service/SubscriptionServiceProvider'
import { setup } from 'react-native-iap'
import StartupService from '~/components/startup-service/StartupService'
import { NotificationsProvider } from '~/components/banner/NotificationsProvider'
import PlayerProvider from '~/components/player/PlayerProvider'

if (__DEV__) {
  require('./reactotron-config')
}

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

setup({ storekitMode: 'STOREKIT2_MODE' })

const AppManager = () => {
  const appStatus = useSelector(s => s.app.appStatus)

  useNotificationListener()
  useDebug()

  if (appStatus !== AppStatus.UP) {
    return <LoadingView />
  }

  return <AppNavigation />
}

function App() {
  return (
    <Provider store={store}>
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar backgroundColor={Color.Black} barStyle="light-content" />

          <SafeAreaProvider>
            <RealmProvider>
              <PaperProvider theme={paperTheme}>
                <PlayerProvider>
                  <NotificationsProvider>
                    <BottomSheetModalProvider>
                      <AppManager />

                      <StartupService />
                      <ModalServiceProvider />
                      <StoriesServiceProvider />
                      <SubscriptionServiceProvider />
                    </BottomSheetModalProvider>
                  </NotificationsProvider>
                </PlayerProvider>
                <ToastService />
              </PaperProvider>
            </RealmProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </Provider>
  )
}

export default App
