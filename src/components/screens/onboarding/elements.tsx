import React, { forwardRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated'
import Button from '~/components/ui/buttons/Button'
import SwitchButton from '~/components/ui/buttons/SwitchButton'
import TextField from '~/components/ui/fields/TextField'
import Surface from '~/components/ui/surface/Surface'
import Text from '~/components/ui/text/Text'
import KeyboardAvoidingScrollView from '~/components/ui/views/KeyboardAvoidingScrollView'
import { W_H_PADDING } from '~/styles'
import { Color } from '~/styles/color'

export const OnboardingScreen = ({ children, onLayout }) => {
  return (
    <KeyboardAvoidingScrollView
      style={{ flex: 1 }}
      bounces={false}
      onLayout={onLayout}
      contentContainerStyle={{ minHeight: '100%', alignItems: 'center' }}
      // keyboardShouldPersistTaps="handled"
      containerStyle={{
        width: '100%',
        maxWidth: 400,
        paddingHorizontal: W_H_PADDING,
        paddingTop: 20,
        paddingBottom: 20,
        flex: 1,
      }}
    >
      {children}
    </KeyboardAvoidingScrollView>
  )
}

export const OnboardingText = ({ children, textStyle = {}, ...props }) => {
  return (
    <View {...props} style={[{ alignItems: 'center' }, props.style]}>
      <Text
        allowFontScaling={false}
        style={[
          {
            fontSize: 18,
            lineHeight: 28,
            textAlign: 'center',
            minWidth: 327,
          },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  )
}

export const OnboardingFade = ({ children, delay = 100 }) => {
  return (
    <Animated.View
      entering={FadeInDown.withInitialValues({
        transform: [{ translateY: -10 }],
      }).delay(delay)}
    >
      {children}
    </Animated.View>
  )
}

export const OnboardintSwitchSurface = ({
  title,
  description,
  value,
  onChange,
}) => {
  const switchRef = useRef()

  return (
    <Surface
      style={{ paddingVertical: 12 }}
      onPress={() => switchRef.current.handlePress()}
    >
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ flex: 1, fontSize: 18, lineHeight: 28, marginRight: 8 }}>
          {title}
        </Text>
        <SwitchButton
          ref={switchRef}
          value={value}
          disabled
          variant={2}
          onChange={onChange}
        />
      </View>
      <Text style={{ color: Color.LightGrey, marginTop: 12 }}>
        {description}
      </Text>
    </Surface>
  )
}

export const BigButton: React.FC<Parameters<typeof Button>[0]> = props => {
  return (
    <Button
      {...props}
      style={[
        {
          backgroundColor: props.disabled ? Color.Grey : Color.AccentBlue,
        },
        props.style,
      ]}
      titleStyle={[{ fontSize: 18, lineHeight: 28 }, props.titleStyle]}
    />
  )
}

export const OnboardingTextField: React.FC<Parameters<typeof TextField>[0]> =
  forwardRef((props, ref) => {
    const { t } = useTranslation()

    return (
      <>
        <TextField
          {...props}
          ref={ref}
          style={[
            {
              borderWidth: 2,
              paddingHorizontal: 14, // 16-2
              ...Platform.select({
                ios: {
                  minHeight: 52,
                  paddingBottom: 3,
                  paddingTop: props.multiline ? 9.5 : 0,
                },
                default: { paddingVertical: 9.5 },
              }),
            },
            props.style,
          ]}
        />

        {props.error && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{ position: 'absolute', bottom: -8 - 24 }}
          >
            <Text
              style={{
                fontSize: 16,
                lineHeight: 24,
                color: Color.AccentRed,
              }}
            >
              {t('onboarding.fill-field-error')}
            </Text>
          </Animated.View>
        )}
      </>
    )
  })
