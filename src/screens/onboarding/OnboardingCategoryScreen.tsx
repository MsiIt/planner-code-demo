import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, {
  FadeInDown,
  FadeOut,
  ReduceMotion,
} from 'react-native-reanimated'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
  OnboardingTextField,
} from '~/components/screens/onboarding/elements'
import RadioButton from '~/components/ui/buttons/RadioButton'
import Surface from '~/components/ui/surface/Surface'
import Text from '~/components/ui/text/Text'
import { inputLengthLimits } from '~/constants/inputs'
import { ScreenName } from '~/constants/navigation'
import { nextFrame } from '~/utils/common'
import { useFormValue } from '~/utils/hooks/use-form-value'

const OnboardingCategoryScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const [category, setCategory] = useState()
  const inputRef = useRef()
  const [showErrors, setShowErrors] = useState(false)
  const [input, setInput, inputError] = useFormValue('', s => {
    if (!s.length) {
      return t('required-field')
    }
  })

  useEffect(() => {
    if (category === 5) {
      nextFrame().then(() => {
        try {
          inputRef.current.focus()
        } catch (error) {
          console.log(error)
        }
      })
    }
  }, [category])

  const next = () => {
    if (category === 5 && !input.trim()) {
      setShowErrors(true)
      return
    }

    if (!category) {
      return
    }

    navigation.push(ScreenName.OnboardingTaskName, {
      ...route.params,
      category,
      categoryName: input.trim(),
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
          <OnboardingText>{t('onboarding.category.line-1')}</OnboardingText>
        </OnboardingFade>

        <View style={{ marginTop: 40 }}>
          <RadioButton.Group
            value={category}
            onValueChange={v => setCategory(v)}
          >
            <View>
              <OnboardingFade delay={200}>
                <RadioButton.Item
                  value={1}
                  ButtonComponent={CategoryButton}
                  title={t('initial-category.finance')}
                />
              </OnboardingFade>
              <View style={{ height: 8 }} />
              <OnboardingFade delay={250}>
                <RadioButton.Item
                  value={2}
                  ButtonComponent={CategoryButton}
                  title={t('initial-category.health')}
                />
              </OnboardingFade>
              <View style={{ height: 8 }} />
              <OnboardingFade delay={300}>
                <RadioButton.Item
                  value={3}
                  ButtonComponent={CategoryButton}
                  title={t('initial-category.relations')}
                />
              </OnboardingFade>
              <View style={{ height: 8 }} />
              <OnboardingFade delay={350}>
                <RadioButton.Item
                  value={4}
                  ButtonComponent={CategoryButton}
                  title={t('initial-category.travel')}
                />
              </OnboardingFade>
            </View>

            <View style={{ height: 40 }} />
            <OnboardingFade delay={400}>
              <RadioButton.Item
                value={5}
                ButtonComponent={CategoryButton}
                title={t('onboarding.category.other')}
              />
            </OnboardingFade>

            <View style={{ marginTop: 8, flexDirection: 'row' }}>
              <OnboardingTextField
                style={{
                  width: 0,
                  paddingHorizontal: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                }}
              />
              {category === 5 && (
                <Animated.View
                  entering={FadeInDown.reduceMotion(
                    ReduceMotion.Never
                  ).withInitialValues({
                    transform: [{ translateY: -10 }],
                  })}
                  exiting={FadeOut.reduceMotion(ReduceMotion.Never)}
                  style={{ flex: 1 }}
                >
                  <OnboardingTextField
                    ref={inputRef}
                    value={input}
                    error={showErrors && inputError}
                    placeholder={t('onboarding.category.placeholder')}
                    maxLength={inputLengthLimits.categoryName}
                    onChangeText={t => setInput(t)}
                  />
                </Animated.View>
              )}
            </View>
          </RadioButton.Group>
        </View>
      </View>

      <OnboardingFade delay={500}>
        <BigButton
          title={t('onboarding.next-button')}
          containerStyle={{ marginTop: 20 }}
          onPress={next}
        />
      </OnboardingFade>
    </OnboardingScreen>
  )
}

const CategoryButton = ({ title, mark, onPress }) => {
  return (
    <Surface
      style={{ flexDirection: 'row', padding: 14, paddingHorizontal: 16 }}
      onPress={onPress}
    >
      {mark}
      <Text numberOfLines={1} style={{ flex: 1, paddingLeft: 8 }}>
        {title}
      </Text>
    </Surface>
  )
}

export default OnboardingCategoryScreen
