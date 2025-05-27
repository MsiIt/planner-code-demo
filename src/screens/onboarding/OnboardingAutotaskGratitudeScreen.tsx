import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
  OnboardintSwitchSurface,
} from '~/components/screens/onboarding/elements'
import { ScreenName } from '~/constants/navigation'

const OnboardingAutotaskGratitudeScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const [enabled, setEnabled] = useState(false)

  const next = () => {
    navigation.push(ScreenName.OnboardingAutotaskAnalysis, {
      ...route.params,
      gratitudeEnabled: enabled,
    })
  }

  return (
    <OnboardingScreen>
      <View
        style={{ marginTop: 'auto', marginBottom: 'auto', paddingVertical: 20 }}
      >
        <OnboardingFade>
          <OnboardingText>
            {t('onboarding.autotask-gratitude.title')}
          </OnboardingText>
        </OnboardingFade>

        <View style={{ marginTop: 40 }}>
          <OnboardingFade delay={200}>
            <OnboardintSwitchSurface
              title={t('onboarding.autotask-gratitude.name')}
              description={t('onboarding.autotask-gratitude.description')}
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

export default OnboardingAutotaskGratitudeScreen
