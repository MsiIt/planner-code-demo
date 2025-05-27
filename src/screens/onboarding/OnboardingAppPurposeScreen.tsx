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
import Icon from '~/components/ui/icons/Icon'
import Text from '~/components/ui/text/Text'
import { ScreenName } from '~/constants/navigation'
import { Color } from '~/styles/color'

const OnboardingAppPurposeScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const next = () => {
    navigation.push(ScreenName.OnboardingGoalName)
  }

  return (
    <OnboardingScreen>
      <View
        style={{ marginTop: 'auto', marginBottom: 'auto', paddingVertical: 20 }}
      >
        <OnboardingFade>
          <OnboardingText>{t('onboarding.app-purpose.line-1')}</OnboardingText>
        </OnboardingFade>

        <OnboardingFade delay={200}>
          <View style={{ flexDirection: 'row', marginTop: 80 }}>
            <Cell
              text={t('onboarding.app-purpose.notify')}
              icon={<Icon name="bell-on" />}
            />
            <Cell
              text={t('onboarding.app-purpose.motivate')}
              icon={<Icon name="education" />}
            />
            <Cell
              text={t('onboarding.app-purpose.teach')}
              icon={<Icon name="message" />}
            />
          </View>
        </OnboardingFade>

        <OnboardingFade delay={300}>
          <FastImage
            source={require('~assets/images/big-curly-bracket.png')}
            resizeMode="cover"
            style={{ width: '100%', height: undefined, aspectRatio: 327 / 44 }}
          />

          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Icon name="star" style={{ tintColor: Color.AccentBlue }} />
            <Text style={{ marginTop: 8, color: Color.AccentBlue }}>
              {t('onboarding.app-purpose.move-to-goal')}
            </Text>
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

const Cell = ({ text, icon }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <View style={{ marginBottom: 8 }}>{icon}</View>
      <Text>{text}</Text>
    </View>
  )
}

export default OnboardingAppPurposeScreen
