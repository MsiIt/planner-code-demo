import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Text from '~/components/ui/text/Text'
import { useRealm } from '~/db'
import { useSettings } from '~/modules/hooks/use-settings'
import { Color } from '~/styles/color'
import { OnboardingFade } from '../onboarding/elements'
import Pressable from '~/components/ui/pressable/Pressable'
import FastImage from 'react-native-fast-image'

const PushNotificationsSettings = () => {
  const { t } = useTranslation()
  const realm = useRealm()
  const settings = useSettings()

  const [mode, setMode] = useState(settings.pushNotificationTypeId)

  const setNotificationMode = m => {
    setTimeout(
      () =>
        realm.write(() => {
          settings.pushNotificationTypeId = m
        }),
      300
    )
    setMode(m)
  }

  return (
    <>
      <Text style={{ color: Color.LightGrey, paddingVertical: 16 }}>
        {t('menu.push-notifications.body')}
      </Text>

      <View style={{ height: 40 }} />
      <OnboardingFade delay={200}>
        <View style={{ gap: 16 }}>
          <View
            style={{
              alignSelf: 'center',
              width: 275,
              height: 24,
              borderRadius: 24,
              backgroundColor: Color.Grey,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 2,
            }}
          >
            <Pressable
              onPress={() => setNotificationMode(1)}
              hitSlop={{ top: 60, bottom: 60, left: 60, right: 60 }}
              style={{ borderRadius: 10 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: mode === 1 ? Color.AccentBlue : Color.Dark,
                }}
              />
            </Pressable>
            <Pressable
              onPress={() => setNotificationMode(2)}
              hitSlop={{ top: 60, bottom: 60, left: 60, right: 60 }}
              style={{ borderRadius: 10 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: mode === 2 ? Color.AccentBlue : Color.Dark,
                }}
              />
            </Pressable>
            <Pressable
              onPress={() => setNotificationMode(3)}
              hitSlop={{ top: 60, bottom: 60, left: 60, right: 60 }}
              style={{ borderRadius: 10 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: mode === 3 ? Color.AccentBlue : Color.Dark,
                }}
              />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontWeight: '600',
                fontSize: 14,
                lineHeight: 16,
                color: mode === 1 ? Color.AccentBlue : Color.White,
              }}
            >
              {t('onboarding.push-mode.off')}
            </Text>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 14,
                lineHeight: 16,
                color: mode === 2 ? Color.AccentBlue : Color.White,
              }}
            >
              {t('onboarding.push-mode.careful')}
            </Text>
            <Text
              style={{
                fontWeight: '600',
                fontSize: 14,
                lineHeight: 16,
                color: mode === 3 ? Color.AccentBlue : Color.White,
              }}
            >
              {t('onboarding.push-mode.trash')}
            </Text>
          </View>
        </View>
      </OnboardingFade>

      {mode === 1 && (
        <OnboardingFade delay={300}>
          <View style={{ alignItems: 'center' }}>
            <FastImage
              source={require('~assets/images/onboarding-push-off.png')}
              resizeMode="contain"
              style={{
                aspectRatio: 317 / 336,
                width: '100%',
                maxWidth: '100%',
                height: undefined,
              }}
            />
          </View>
        </OnboardingFade>
      )}
      {mode === 2 && (
        <OnboardingFade delay={300}>
          <View style={{ alignItems: 'center' }}>
            <FastImage
              source={require('~assets/images/onboarding-push-careful.png')}
              resizeMode="contain"
              style={{
                aspectRatio: 317 / 336,
                width: '100%',
                maxWidth: '100%',
                height: undefined,
              }}
            />
          </View>
        </OnboardingFade>
      )}
      {mode === 3 && (
        <OnboardingFade delay={300}>
          <View style={{ alignItems: 'center' }}>
            <FastImage
              source={require('~assets/images/onboarding-push-trash.png')}
              resizeMode="contain"
              style={{
                aspectRatio: 317 / 336,
                width: '100%',
                maxWidth: '100%',
                height: undefined,
              }}
            />
          </View>
        </OnboardingFade>
      )}
    </>
  )
}

export default PushNotificationsSettings
