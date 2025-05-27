import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
} from '~/components/screens/onboarding/elements'
import Text from '~/components/ui/text/Text'
import { ScreenName } from '~/constants/navigation'
import { Color } from '~/styles/color'

const OnboardingPushSettingsScreen = ({ route, navigation }) => {
  const { t } = useTranslation()
  const [mode, setMode] = useState(2)

  const next = () => {
    if (mode !== 1) {
      navigation.push(ScreenName.OnboardingPushConfirmation, {
        ...route.params,
        mode,
      })
    } else {
      navigation.push(ScreenName.OnboardingAutotaskGratitude, {
        ...route.params,
        mode,
      })
    }
  }

  return (
    <OnboardingScreen>
      <View
        style={{
          marginTop: 'auto',
          marginBottom: 'auto',
          paddingVertical: 15,
        }}
      >
        <OnboardingFade>
          <OnboardingText>
            {t('onboarding.push-settings.line-1')}
          </OnboardingText>
        </OnboardingFade>
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
                onPress={() => setMode(1)}
                hitSlop={{ top: 60, bottom: 60, left: 60, right: 60 }}
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
                onPress={() => setMode(2)}
                hitSlop={{ top: 60, bottom: 60, left: 60, right: 60 }}
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
                onPress={() => setMode(3)}
                hitSlop={{ top: 60, bottom: 60, left: 60, right: 60 }}
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
        <View style={{ height: 150 }} />

        {mode === 1 && (
          <OnboardingFade delay={300}>
            <View
              style={{
                alignItems: 'center',
                height: 150,
              }}
            >
              <FastImage
                source={require('~assets/images/onboarding-push-off.png')}
                resizeMode="contain"
                style={{
                  aspectRatio: 317 / 336,
                  width: '100%',
                  maxWidth: '90%',
                  bottom: 140,
                  height: undefined,
                }}
              />
            </View>
          </OnboardingFade>
        )}
        {mode === 2 && (
          <OnboardingFade delay={300}>
            <View
              style={{
                alignItems: 'center',
                height: 150,
              }}
            >
              <FastImage
                source={require('~assets/images/onboarding-push-careful.png')}
                resizeMode="contain"
                style={{
                  aspectRatio: 317 / 336,
                  width: '100%',
                  maxWidth: '90%',
                  bottom: 140,
                  height: undefined,
                }}
              />
            </View>
          </OnboardingFade>
        )}
        {mode === 3 && (
          <OnboardingFade delay={300}>
            <View style={{ alignItems: 'center', height: 150 }}>
              <FastImage
                source={require('~assets/images/onboarding-push-trash.png')}
                resizeMode="contain"
                style={{
                  aspectRatio: 317 / 336,
                  width: '100%',
                  maxWidth: '90%',
                  bottom: 140,
                  height: undefined,
                }}
              />
            </View>
          </OnboardingFade>
        )}
      </View>

      <OnboardingFade delay={400}>
        <BigButton title={t('onboarding.next-button')} onPress={next} />
      </OnboardingFade>
    </OnboardingScreen>
  )
}

export default OnboardingPushSettingsScreen
