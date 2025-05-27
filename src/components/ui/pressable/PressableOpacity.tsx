import React from 'react'
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native'
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { getInsets } from '~/utils/react-native'

interface Props extends PressableProps {
  containerStyle?: StyleProp<ViewStyle>
  isFoldedPlayer?: Boolean
}

const PressableOpacity: React.FC<Props> = ({
  children,
  style,
  containerStyle,
  hitSlop,
  isFoldedPlayer,
  ...props
}) => {
  const opacity = useSharedValue(1)

  const fadeIn = () => {
    opacity.value = withTiming(0.2, {
      duration: 20,
      reduceMotion: ReduceMotion.Never,
    })
  }
  const playerFadeIn = () => {
    opacity.value = withTiming(0.9, {
      duration: 20,
      reduceMotion: ReduceMotion.Never,
    })
  }
  const fadeOut = () => {
    opacity.value = withTiming(1, {
      duration: 200,
      reduceMotion: ReduceMotion.Never,
    })
  }

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value }
  }, [])

  return (
    <Animated.View
      style={[containerStyle, animatedStyle]}
      hitSlop={getInsets(hitSlop)}
    >
      {!isFoldedPlayer && (
        <Pressable
          onPressIn={fadeIn}
          onPressOut={fadeOut}
          hitSlop={hitSlop}
          style={[{ overflow: 'hidden' }, style]}
          {...props}
        >
          {children}
        </Pressable>
      )}
      {isFoldedPlayer && (
        <Pressable
          onPressIn={playerFadeIn}
          onPressOut={fadeOut}
          hitSlop={hitSlop}
          style={[{ overflow: 'hidden' }, style]}
          {...props}
        >
          {children}
        </Pressable>
      )}
    </Animated.View>
  )
}

export default PressableOpacity
