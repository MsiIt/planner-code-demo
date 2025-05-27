import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { Circle, Svg } from 'react-native-svg'
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

const OnboardingSplitIntroScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const next = () => {
    navigation.push(ScreenName.OnboardingAppPurpose)
  }

  return (
    <OnboardingScreen>
      <View
        style={{ marginTop: 'auto', marginBottom: 'auto', paddingVertical: 20 }}
      >
        <OnboardingFade>
          <OnboardingText>{t('onboarding.split-intro.line-1')}</OnboardingText>
        </OnboardingFade>

        <OnboardingFade delay={200}>
          <View
            style={{
              marginTop: 80,
              flexDirection: 'row',
              paddingBottom: 10,
            }}
          >
            <Cell />
            <Cell>
              <Text
                style={{
                  color: Color.LightGrey,
                  fontSize: 12,
                  lineHeight: 16,
                }}
              >
                {t('onboarding.split-intro.day-1')}
              </Text>
            </Cell>
            <Cell>
              <Text
                style={{
                  color: Color.LightGrey,
                  fontSize: 12,
                  lineHeight: 16,
                }}
              >
                {t('onboarding.split-intro.day-2')}
              </Text>
            </Cell>
            <Cell />
            <Cell />
            <Cell>
              <View style={{ paddingBottom: 2 }}>
                <Icon name="star" style={{ tintColor: Color.AccentBlue }} />
              </View>
            </Cell>
          </View>

          <View style={{ flexDirection: 'row', height: 1 }}>
            <View style={{ flex: 1 }} />
            <Dot />
            <View
              style={[
                {
                  flex: 11,
                  borderBottomColor: Color.Transparent,
                  borderBottomWidth: 1,
                  flexDirection: 'row',
                },
                Platform.OS === 'android' && {
                  borderBottomColor: Color.Grey,
                  borderStyle: 'dashed',
                },
              ]}
            >
              {Platform.OS === 'ios' && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      borderColor: Color.Grey,
                      borderWidth: 1,
                      borderStyle: 'dashed',
                    }}
                  />
                </View>
              )}

              <View style={{ flex: 0.4 }} />
              <Cell>
                <Dot color={Color.LightGrey} />
              </Cell>
              <Cell>
                <Dot color={Color.LightGrey} />
              </Cell>
              <Cell>
                <Dot />
              </Cell>
              <Cell>
                <Dot />
              </Cell>
              <View style={{ flex: 0.4 }} />
            </View>
            <Dot color={Color.AccentBlue} />
            <View style={{ flex: 1 }} />
          </View>

          <View style={{ flexDirection: 'row', paddingTop: 8 }}>
            <Cell>
              <Text style={{ fontSize: 12, lineHeight: 16 }}>
                {t('onboarding.split-intro.begin')}
              </Text>
            </Cell>
            <Cell />
            <Cell />
            <Cell />
            <Cell />
            <Cell>
              <Text
                style={{
                  color: Color.AccentBlue,
                  fontSize: 12,
                  lineHeight: 16,
                }}
              >
                {t('onboarding.split-intro.goal')}
              </Text>
            </Cell>
          </View>
        </OnboardingFade>
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

const Cell = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {children}
    </View>
  )
}

const Dot = ({ color }) => {
  return (
    <View style={{ top: -3.2 }}>
      <Svg width={8} height={8}>
        <Circle cx={4} cy={4} r={4} fill={color ?? Color.Grey} />
      </Svg>
    </View>
  )
}

export default OnboardingSplitIntroScreen
