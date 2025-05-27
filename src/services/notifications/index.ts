import notifee, {
  AndroidNotificationSetting,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native'
import { useEffect } from 'react'
import { notificationObserver } from './notification-observer'

export class NotificationService {
  static async requestPermission() {
    await notifee.requestPermission()

    const settings = await this.getNotificationSettings()
    if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
      // ok
    } else {
      // Show some user information to educate them on what exact alarm permission is,
      // and why it is necessary for your app functionality, then send them to system preferences:
      await notifee.openAlarmPermissionSettings()
    }

    return settings
  }

  static async getNotificationSettings() {
    return await notifee.getNotificationSettings()
  }

  static async openNotificationSettings() {
    return await notifee.openNotificationSettings()
  }

  static async schedule({
    text,
    timestamp,
    repeatFrequency = RepeatFrequency.NONE,
    title = '',
  }: {
    text: string
    timestamp: number
    repeatFrequency?: RepeatFrequency
    title?: string
  }) {
    await this.requestPermission()

    const channelId = await notifee.createChannel({
      id: 'general',
      name: 'General',
    })

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: timestamp,
      repeatFrequency,
    }

    const reqData = {
      body: text,
      android: {
        channelId,
        smallIcon: 'ic_notification',
        pressAction: { id: 'default' },
      },
    }

    if (title) {
      reqData.title = title
    }

    return await notifee.createTriggerNotification(reqData, trigger)
  }

  static async cancelNotiication(id?: string | null) {
    if (!id) {
      return
    }

    await notifee.cancelNotification(id)
  }
}

export const useNotificationListener = () => {
  useEffect(() => {
    return notifee.onForegroundEvent(notificationObserver)
  }, [])
}

notifee.onBackgroundEvent(notificationObserver)
