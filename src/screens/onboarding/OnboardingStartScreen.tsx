import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
} from '~/components/screens/onboarding/elements'
import Text from '~/components/ui/text/Text'
import { ScreenName } from '~/constants/navigation'
import { Color } from '~/styles/color'
import { nextFrame } from '~/utils/common'

const OnboardingStartScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const next = () => {
    navigation.push(ScreenName.OnboardingTimered)
  }

  // fix glich with initial render when
  // container height calculate incorrectly
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  return (
    <OnboardingScreen onLayout={() => setShow(true)}>
      {show && (
        <>
          <View
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              paddingVertical: 20,
            }}
            onLayout={() => {
              nextFrame().then(() => {
                setShow2(true)
              })
            }}
          >
            <OnboardingFade>
              <OnboardingText>{t('onboarding.start.line-1')}</OnboardingText>
            </OnboardingFade>
            <OnboardingFade delay={200}>
              <OnboardingText style={{ marginTop: 40 }}>
                {t('onboarding.start.line-2')}
              </OnboardingText>
            </OnboardingFade>

            {show2 && (
              <OnboardingFade delay={200}>
                <View
                  style={{
                    marginTop: 40,
                    width: '100%',
                    height: undefined,
                    borderRadius: 999,
                    borderWidth: 8,
                    aspectRatio: 1,
                    borderColor: Color.AccentBlue,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 56,
                      lineHeight: 72,
                      letterSpacing: -0.5,
                    }}
                  >
                    03:00
                  </Text>
                </View>
              </OnboardingFade>
            )}
          </View>

          <OnboardingFade delay={400}>
            <BigButton
              title={t('onboarding.start.button')}
              containerStyle={{ marginTop: 20 }}
              onPress={next}
            />
          </OnboardingFade>
        </>
      )}
    </OnboardingScreen>
  )
}

export default OnboardingStartScreen
