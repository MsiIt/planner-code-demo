import _ from 'lodash'
import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Time } from '~/@types'
import Button from '~/components/ui/buttons/Button'
import SwitchButton from '~/components/ui/buttons/SwitchButton'
import TimeField from '~/components/ui/fields/TimeField'
import Icon from '~/components/ui/icons/Icon'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import Divider from '~/components/ui/surface/Divider'
import Surface from '~/components/ui/surface/Surface'
import Text from '~/components/ui/text/Text'
import { useRealm } from '~/db'
import { DailyNotificationsModule } from '~/modules/daily-notifications'
import { useMoment } from '~/modules/hooks/use-moment'
import { useSettings } from '~/modules/hooks/use-settings'
import { Color } from '~/styles/color'
import { DateUtils } from '~/utils/date'

const NotificationSettings = () => {
  const { t } = useTranslation()
  const realm = useRealm()
  const settings = useSettings()

  const reschedule = useMemo(
    () =>
      _.debounce(() => {
        new DailyNotificationsModule(realm, true).process().catch(() => 0)
      }, 1000),
    []
  )

  const handleMorningSwitch = (v: boolean) => {
    setTimeout(() => {
      realm.write(() => {
        settings.morningNotificationEnabled = v
      })
    }, 300)
    setTimeout(() => {
      realm.write(() => {
        reschedule()
      })
    }, 600)
  }
  const handleMorningTimeChange = (time: Time) => {
    realm.write(() => {
      settings.morningNotificationTime = time
    })
    setTimeout(() => {
      realm.write(() => {
        reschedule()
      })
    }, 600)
  }

  const handleEveningSwitch = (v: boolean) => {
    setTimeout(() => {
      realm.write(() => {
        settings.eveningNotificationEnabled = v
      })
    }, 300)
    setTimeout(() => {
      realm.write(() => {
        reschedule()
      })
    }, 600)
  }
  const handleEveningTimeChange = (time: Time) => {
    realm.write(() => {
      settings.eveningNotificationTime = time
    })
    setTimeout(() => {
      realm.write(() => {
        reschedule()
      })
    }, 600)
  }

  return (
    <>
      <Text style={{ color: Color.LightGrey, paddingVertical: 16 }}>
        {t('menu.notifications.body')}
      </Text>

      <Item
        title={t('menu.notifications.morning.title')}
        subtitle={t('menu.notifications.morning.subtitle')}
        value={settings.morningNotificationEnabled}
        time={settings.morningNotificationTime}
        onValueChange={handleMorningSwitch}
        onTimeChange={handleMorningTimeChange}
      />
      <View style={{ height: 8 }} />
      <Item
        title={t('menu.notifications.evening.title')}
        subtitle={t('menu.notifications.evening.subtitle')}
        value={settings.eveningNotificationEnabled}
        time={settings.eveningNotificationTime}
        onValueChange={handleEveningSwitch}
        onTimeChange={handleEveningTimeChange}
      />
    </>
  )
}

const Item = ({
  title,
  subtitle,
  value,
  time,
  onValueChange,
  onTimeChange,
}) => {
  const { t } = useTranslation()
  const moment = useMoment()
  const settings = useSettings()
  const switchRef = useRef()

  const [timeValue, setTimeValue] = useState(time)
  const [editing, setEditing] = useState(false)

  const timeText = new DateUtils(moment, settings.is12hFormat).formatTime(
    timeValue
  )

  const commit = () => {
    onTimeChange(timeValue)
    setEditing(false)
  }

  return (
    <Surface style={{ padding: 0, paddingHorizontal: 12 }}>
      <PressableOpacity
        style={{ flexDirection: 'row', paddingVertical: 12 }}
        onPress={() => switchRef.current.handlePress()}
      >
        <View style={{ flex: 1 }}>
          <Text>{title}</Text>
          <Text
            style={{
              marginTop: 4,
              color: Color.LightGrey,
              fontSize: 12,
              lineHeight: 16,
            }}
          >
            {subtitle}
          </Text>
        </View>

        <View style={{ marginLeft: 8 }}>
          <SwitchButton
            ref={switchRef}
            value={value}
            disabled
            onChange={onValueChange}
          />
        </View>
      </PressableOpacity>

      <Divider style={{ marginHorizontal: 0 }} />
      <View style={{ paddingVertical: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{t('menu.notifications.time')}</Text>

          {!editing && (
            <>
              <Text style={{ marginLeft: 8 }}>{timeText}</Text>
              <PressableOpacity
                hitSlop={15}
                containerStyle={{ marginLeft: 'auto' }}
                onPress={() => setEditing(true)}
              >
                <Icon name="edit" />
              </PressableOpacity>
            </>
          )}

          {editing && (
            <>
              <View style={{ marginLeft: 8, flex: 1 }}>
                <TimeField
                  time={timeValue}
                  onTimeChange={t => setTimeValue(t)}
                />
              </View>
              <Button containerStyle={{ marginLeft: 8 }} onPress={commit}>
                <Icon name="check" style={{ tintColor: Color.AccentBlue }} />
              </Button>
            </>
          )}
        </View>
      </View>
    </Surface>
  )
}

export default NotificationSettings
