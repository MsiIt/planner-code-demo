import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
} from '~/components/screens/onboarding/elements'
import { RNText } from '~/components/ui/text/Text'
import { ScreenName } from '~/constants/navigation'
import { Color } from '~/styles/color'

const OnboardingNotificationsScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const next = async () => {
    // const status = await NotificationService.requestPermission()

    // if (
    //   status.authorizationStatus === AuthorizationStatus.DENIED &&
    //   Platform.OS === 'android'
    // ) {
    //   await NotificationService.openNotificationSettings()
    //   await sleep(500)
    // }

    navigation.push(ScreenName.OnboardingFinish, {
      ...route.params,
    })
  }

  return (
    <OnboardingScreen>
      <View
        style={{ marginTop: 'auto', marginBottom: 'auto', paddingVertical: 20 }}
      >
        <OnboardingFade>
          <OnboardingText>
            {t('onboarding.notifications.line-1')}
          </OnboardingText>
        </OnboardingFade>
        <OnboardingFade delay={200}>
          <OnboardingText style={{ marginTop: 40 }}>
            <RNText>{t('onboarding.notifications.line-2.1')}</RNText>
            <RNText style={{ color: Color.AccentBlue }}>
              {t('onboarding.notifications.line-2.2')}
            </RNText>
            <RNText>{t('onboarding.notifications.line-2.3')}</RNText>
          </OnboardingText>
        </OnboardingFade>
      </View>

      <OnboardingFade delay={400}>
        <BigButton
          title={t('onboarding.next-button')}
          containerStyle={{ marginTop: 20 }}
          onPress={next}
        />
      </OnboardingFade>
    </OnboardingScreen>
  )
}

export default OnboardingNotificationsScreen
