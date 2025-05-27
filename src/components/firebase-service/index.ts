import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useCallback, useEffect } from 'react'
import messaging, { messagingEmitter } from '~/services/firebase/messaging'
import analytics from '@react-native-firebase/analytics'

export const FirebaseUserService = () => {
  useNotificationOpenedApp()

  const onMessage = useCallback(
    (message: FirebaseMessagingTypes.RemoteMessage) => {
      // process message
    },
    []
  )

  // messaging listener
  useEffect(() => {
    return messaging().onMessage(message => {
      console.log(
        'FM messaging | foreground message',
        JSON.stringify(message, null, 2)
      )

      return onMessage(message)
    })
  }, [onMessage])

  // background message handler
  useEffect(() => {
    return messagingEmitter.on('message', message => {
      onMessage(message)
    })
  }, [onMessage])

  return null
}

const useNotificationOpenedApp = () => {
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.data?.campaign_id) {
        analytics().logEvent('push_open', {
          campaign_id: remoteMessage.data.campaign_id,
        })
      } else {
        analytics().logEvent('push_open')
      }
    })

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.campaign_id) {
          analytics().logEvent('push_open', {
            campaign_id: remoteMessage.data.campaign_id,
          })
        } else {
          analytics().logEvent('push_open')
        }
      })

    return unsubscribe
  }, [])
}
