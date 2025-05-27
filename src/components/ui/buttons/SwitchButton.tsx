import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { StyleSheet, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
  ReduceMotion,
} from 'react-native-reanimated'
import { Color } from '~/styles/color'

const SwitchButton = (
  { value, variant = 1, disabled = false, onChange },
  ref
) => {
  const [enabled, setEnabled] = useState(value)

  const is1Variant = variant === 1

  const animationValue = useSharedValue(value ? 1 : 0)

  const handlePress = () => {
    const newValue = !enabled
    setEnabled(newValue)
    animationValue.value = withTiming(newValue ? 1 : 0, {
      duration: 200,
      reduceMotion: ReduceMotion.Never,
    })
    onChange?.(newValue)
  }

  useImperativeHandle(ref, () => ({ handlePress }))

  useEffect(() => {
    animationValue.value = withTiming(value ? 1 : 0, {
      duration: 200,
      reduceMotion: ReduceMotion.Never,
    })
    setEnabled(value)
  }, [value])

  const switchStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animationValue.value,
            [0, 1],
            [0, is1Variant ? 12 : 20]
          ),
        },
      ],
      opacity: interpolate(animationValue.value, [0, 1], [0.5, 1]),
    }
  }, [])

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animationValue.value,
        [0, 1],
        [Color.Grey, Color.AccentBlue]
      ),
    }
  }, [])

  return (
    <Pressable disabled={disabled} hitSlop={15} onPress={handlePress}>
      <Animated.View
        style={[
          is1Variant ? styles1.container : styles2.container,
          containerStyle,
        ]}
      >
        <Animated.View
          style={[is1Variant ? styles1.switch : styles2.switch, switchStyle]}
        />
      </Animated.View>
    </Pressable>
  )
}

const styles1 = StyleSheet.create({
  container: {
    padding: 2,
    width: 32,
    height: 20,
    borderRadius: 10,
  },
  switch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
})

const styles2 = StyleSheet.create({
  container: {
    padding: 3,
    width: 48,
    height: 28,
    borderRadius: 14,
  },
  switch: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
})

export default forwardRef(SwitchButton)
