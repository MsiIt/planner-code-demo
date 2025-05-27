import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import FastImage from 'react-native-fast-image'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
} from '~/components/screens/onboarding/elements'
import { ScreenName } from '~/constants/navigation'

const OnboardingTaskSaveScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const next = () => {
    navigation.push(ScreenName.OnboardingAiAdvertisement, {
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
        }}
      >
        <OnboardingFade>
          <OnboardingText>{t('onboarding.task-save.line-1')}</OnboardingText>
        </OnboardingFade>
        <View style={{ height: 40 }} />
        <OnboardingFade delay={200}>
          <OnboardingText>{t('onboarding.task-save.line-2')}</OnboardingText>
        </OnboardingFade>

        <OnboardingFade delay={300}>
          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <FastImage
              source={require('~assets/images/onboarding-phone.png')}
              resizeMode="contain"
              style={{
                aspectRatio: 317 / 336,
                width: 317,
                maxWidth: '100%',
                height: undefined,
              }}
            />
          </View>
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

export default OnboardingTaskSaveScreen
