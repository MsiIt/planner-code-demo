import { RepeatFrequency } from '@notifee/react-native'
import { t } from 'i18next'
import moment from 'moment'
import { Time } from '~/@types'
import { DATE_FORMAT } from '~/constants'
import { User } from '~/db/models/user'
import { NotificationService } from '~/services/notifications'
import { assert } from '~/utils/assertion'
import { dayTimeToDate } from '~/utils/date'

export class DailyNotificationsModule {
  realm: Realm
  reschedule: boolean

  constructor(realm: Realm, reschedule = false) {
    this.realm = realm
    this.reschedule = reschedule
  }

  async process() {
    console.log('-- scheduling daily notifications: start')

    try {
      const user = this.realm.objects(User)[0]
      assert(user)

      const morningNotificationId = await this.processSingleType(
        user.settings.morningNotificationEnabled,
        user.settings.morningNotificationId,
        user.settings.morningNotificationTime,
        t('daily-notification.morning.text')
      )
      const eveningNotificationId = await this.processSingleType(
        user.settings.eveningNotificationEnabled,
        user.settings.eveningNotificationId,
        user.settings.eveningNotificationTime,
        t('daily-notification.evening.text')
      )

      this.realm.write(() => {
        user.settings.morningNotificationId = morningNotificationId
        user.settings.eveningNotificationId = eveningNotificationId
      })

      console.log('-- scheduling daily notifications: finish')
    } catch (error) {
      console.warn('-- scheduling daily notifications: error')
      console.warn(error)
      throw error
    }
  }

  private async processSingleType(
    enabled: boolean,
    notificationId: string | null,
    time: Time,
    message: string
  ) {
    // deleting
    if (!enabled || this.reschedule) {
      await NotificationService.cancelNotiication(notificationId)
      notificationId = null
    }

    // scheduling
    if (enabled && !notificationId) {
      const date = dayTimeToDate(moment().format(DATE_FORMAT), time)
      const m = moment(date)

      if (moment().isAfter(m)) {
        m.add(1, 'day')
      }

      notificationId = await NotificationService.schedule({
        title: t('notifications.task.title'),
        text: message,
        timestamp: m.toDate().getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
      })
    }

    return notificationId
  }
}
