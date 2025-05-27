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

const OnboardingTaskNameScreen = ({ route, navigation }) => {
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

    navigation.push(ScreenName.OnboardingTaskSave, {
      ...route.params,
      taskName: input.trim(),
    })
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
          <OnboardingText>{t('onboarding.task-name.line-1')}</OnboardingText>
        </OnboardingFade>
        <View style={{ height: 40 }} />
        <OnboardingFade delay={200}>
          <OnboardingText>{t('onboarding.task-name.line-2')}</OnboardingText>
        </OnboardingFade>

        <View style={{ marginTop: 40 }}>
          <OnboardingFade delay={300}>
            <OnboardingTextField
              value={input}
              error={showErrors && inputError}
              placeholder={t('onboarding.task-name.placeholder')}
              maxLength={inputLengthLimits.taskName}
              onChangeText={t => setInput(t)}
            />
          </OnboardingFade>
        </View>
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

export default OnboardingTaskNameScreen
