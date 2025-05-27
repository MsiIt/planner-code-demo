import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import SwitchButton from '~/components/ui/buttons/SwitchButton'
import Icon from '~/components/ui/icons/Icon'
import Surface from '~/components/ui/surface/Surface'
import Text from '~/components/ui/text/Text'
import { useRealm } from '~/db'
import { useSettings } from '~/modules/hooks/use-settings'
import { Color } from '~/styles/color'

const TimeSettings = () => {
  const { t } = useTranslation()
  const realm = useRealm()
  const settings = useSettings()
  const switchRef = useRef()

  const handleChangeTimeFormat = v => {
    setTimeout(
      () =>
        realm.write(() => {
          settings.is12hFormat = v
        }),
      300
    )
  }

  return (
    <>
      <Surface
        style={{ padding: 12 }}
        onPress={() => switchRef.current.handlePress()}
      >
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Icon name="clock" />
          </View>

          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text>{t('menu.time.12h.title')}</Text>
            <Text
              style={{
                marginTop: 3,
                fontSize: 12,
                lineHeight: 16,
                color: Color.LightGrey,
              }}
            >
              {t('menu.time.12h.subtitle')}
            </Text>
          </View>

          <View style={{ marginLeft: 8 }}>
            <SwitchButton
              ref={switchRef}
              value={settings.is12hFormat}
              disabled
              onChange={handleChangeTimeFormat}
            />
          </View>
        </View>
      </Surface>
    </>
  )
}

export default TimeSettings
