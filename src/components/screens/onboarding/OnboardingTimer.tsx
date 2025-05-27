import moment from 'moment'
import React, { useContext, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'
import Text from '~/components/ui/text/Text'
import { Color } from '~/styles/color'
import { TimerContext } from '~/navigation/OnboardingNavigator'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const max = 1
const radius = 90
const c = radius * 2 * Math.PI

const length = 120

const OnboardingTimer = () => {
  const progressValue = useSharedValue(0)
  // const [seconds, setSeconds] = useState(length)
  const { seconds, setSeconds } = useContext(TimerContext)

  useEffect(() => {
    progressValue.value = withTiming(max * 30, {
      duration: length * 1000 * 30,
      easing: Easing.linear,
      reduceMotion: ReduceMotion.Never,
    })
  }, [])

  const progressProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: ((max - Math.min(progressValue.value, max)) / max) * c,
    }
  }, [])

  useDerivedValue(() => {
    const remain = Math.min(Math.ceil(progressValue.value * length), 3599)
    runOnJS(setSeconds)(remain)
  }, [])

  return (
    <View style={{ alignSelf: 'flex-start' }}>
      <Svg
        width={80}
        height={80}
        viewBox="0 0 200 200"
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          {...defaultCircleProps}
          stroke={Color.Dark}
          fill={Color.Dark}
          strokeDashoffset={0}
        />
        <AnimatedCircle
          {...defaultCircleProps}
          stroke={Color.AccentBlue}
          // responsible for timer animation
          // animatedProps={progressProps}
        />
      </Svg>

      <View
        style={[
          StyleSheet.absoluteFill,
          { alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        <Text style={{ fontSize: 18, lineHeight: 24, letterSpacing: -0.5 }}>
          {moment.utc(seconds * 1000).format('mm:ss')}
        </Text>
      </View>
    </View>
  )
}

const defaultCircleProps = {
  cx: 100,
  cy: 100,
  r: radius,
  strokeWidth: 10,
  fill: 'transparent',
  strokeDasharray: 565.48,
}

export default OnboardingTimer
