import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
  OnboardingTextField,
} from '~/components/screens/onboarding/elements'
import { inputLengthLimits } from '~/constants/inputs'
import { ScreenName } from '~/constants/navigation'
import { useFormValue } from '~/utils/hooks/use-form-value'

const OnboardingGoalNameScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const [showErrors, setShowErrors] = useState(false)
  const [input, setInput, inputError] = useFormValue('', s => {
    if (!s.length) {
      return t('required-field')
    }
  })

  const next = () => {
    if (!input.trim()) {
      setShowErrors(true)
      return
    }

    navigation.push(ScreenName.OnboardingCategory, { goalName: input.trim() })
  }

  return (
    <OnboardingScreen>
      <View
        style={{
          marginTop: 'auto',
          marginBottom: 'auto',
          paddingVertical: 20,
        }}
      >
        <OnboardingFade>
          <OnboardingText>{t('onboarding.goal-name.line-1')}</OnboardingText>
        </OnboardingFade>
        <OnboardingFade delay={200}>
          <OnboardingText style={{ marginTop: 40 }}>
            {t('onboarding.goal-name.line-2')}
          </OnboardingText>
        </OnboardingFade>

        <OnboardingFade delay={300}>
          <View style={{ marginTop: 40 }}>
            <OnboardingTextField
              value={input}
              error={showErrors && inputError}
              placeholder={t('onboarding.goal-name.placeholder')}
              maxLength={inputLengthLimits.goalName}
              onChangeText={t => setInput(t)}
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

export default OnboardingGoalNameScreen
