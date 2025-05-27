import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
} from '~/components/screens/onboarding/elements'
import { ScreenName } from '~/constants/navigation'

const OnboardingSettingsIntroScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const next = () => {
    navigation.push(ScreenName.OnboardingPushSettings, {
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
            {t('onboarding.settings-intro.line-1')}
          </OnboardingText>
        </OnboardingFade>
        <OnboardingFade delay={200}>
          <OnboardingText style={{ marginTop: 40 }}>
            {t('onboarding.settings-intro.line-2')}
          </OnboardingText>
        </OnboardingFade>
        {/* <OnboardingFade delay={300}>
          <OnboardingText style={{ marginTop: 40 }}>
            {t('onboarding.settings-intro.line-3')}
          </OnboardingText>
        </OnboardingFade> */}
      </View>

      <OnboardingFade delay={400}>
        <BigButton
          title={t('onboarding.settings-intro.button')}
          containerStyle={{ marginTop: 20 }}
          onPress={next}
        />
      </OnboardingFade>
    </OnboardingScreen>
  )
}

export default OnboardingSettingsIntroScreen
