import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
} from '~/components/screens/onboarding/elements'
import { ScreenName } from '~/constants/navigation'

const OnboardingAIAdvertisementScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const next = () => {
    navigation.push(ScreenName.OnboardingSettingsIntro, {
      ...route.params,
    })
  }

  return (
    <OnboardingScreen>
      <View
        style={{
          marginTop: 'auto',
          marginBottom: 'auto',
          paddingVertical: 15,
          justifyContent: 'space-between',
        }}
      >
        <OnboardingFade>
          <OnboardingText>
            {t('onboarding.ai-advertisement.line-1')}
          </OnboardingText>
        </OnboardingFade>
        <View style={{ height: 40 }} />

        <OnboardingFade delay={300}>
          <View
            style={{
              marginTop: 40,
              alignItems: 'center',
            }}
          >
            <Image
              source={require('~assets/images/onboarding-phone-ai.png')}
              style={{
                width: 277.33,
                height: 321.33,
              }}
            />
          </View>
        </OnboardingFade>
      </View>

      <OnboardingFade delay={400}>
        <BigButton title={t('onboarding.next-button')} onPress={next} />
      </OnboardingFade>
    </OnboardingScreen>
  )
}

export default OnboardingAIAdvertisementScreen
