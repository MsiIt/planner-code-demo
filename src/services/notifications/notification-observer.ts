import { Event, EventType } from '@notifee/react-native'
import { openRealm } from '~/db'
import { TaskNotification } from '~/db/models/task-notification'
import analytics from '@react-native-firebase/analytics'

export const notificationObserver = async (event: Event) => {
  const { notification, pressAction } = event.detail
  const type = event.type

  if (type === EventType.PRESS) {
    if (notification?.id) {
      analytics().logEvent('push_open', {
        campaign_id: notification.id,
      })
    } else {
      analytics().logEvent('push_open')
    }
  }

  if (notification && type === EventType.DELIVERED) {
    const realm = await openRealm()

    if (realm) {
      realm.write(() => {
        try {
          const taskNotification = realm
            .objects(TaskNotification)
            .filtered('notificationId == $0', notification.id)[0]

          if (taskNotification) {
            realm.delete(taskNotification)
          } else {
            console.log(
              'notification entry not found or it is a daily notification'
            )
          }
        } catch (err) {
          console.log('error in notification observer:', err)
        }
      })
    }
  }
}
