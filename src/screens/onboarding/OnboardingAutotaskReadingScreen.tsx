import { AuthorizationStatus } from '@notifee/react-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
  OnboardintSwitchSurface,
} from '~/components/screens/onboarding/elements'
import { ScreenName } from '~/constants/navigation'
import { NotificationService } from '~/services/notifications'

const OnboardingAutotaskReadingScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const [enabled, setEnabled] = useState(false)

  const next = async () => {
    // const settings = await NotificationService.getNotificationSettings()

    // const screenName =
    //   settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED
    //     ? ScreenName.OnboardingNotifications
    //     : ScreenName.OnboardingFinish

    // navigation.push(screenName, {
    //   ...route.params,
    //   readingEnabled: enabled,
    // })

    navigation.push(ScreenName.OnboardingFinish, {
      ...route.params,
      readingEnabled: enabled,
    })
  }

  return (
    <OnboardingScreen>
      <View
        style={{ marginTop: 'auto', marginBottom: 'auto', paddingVertical: 20 }}
      >
        <OnboardingFade>
          <OnboardingText>
            {t('onboarding.autotask-reading.title')}
          </OnboardingText>
        </OnboardingFade>

        <View style={{ marginTop: 40 }}>
          <OnboardingFade delay={200}>
            <OnboardintSwitchSurface
              title={t('onboarding.autotask-reading.name')}
              description={t('onboarding.autotask-reading.description')}
              value={enabled}
              onChange={e => setEnabled(e)}
            />
          </OnboardingFade>
        </View>
      </View>

      <OnboardingFade delay={300}>
        <BigButton
          title={t('onboarding.next-button')}
          containerStyle={{ marginTop: 20 }}
          onPress={next}
        />
      </OnboardingFade>
    </OnboardingScreen>
  )
}

export default OnboardingAutotaskReadingScreen
