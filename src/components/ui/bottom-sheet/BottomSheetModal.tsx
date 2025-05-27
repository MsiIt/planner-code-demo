import React, { forwardRef, useCallback, useMemo } from 'react'
import {
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetHandleProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { View } from 'react-native'
import { Color } from '~/styles/color'
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
} from 'react-native-reanimated'
import { BOTTOM_SHEET_RADIUS } from '~/styles'
import { BlurView } from '@react-native-community/blur'

export { BottomSheetModal as BSModal } from '@gorhom/bottom-sheet'

type BottomSheetModalProps = Parameters<typeof BottomSheetModal>[0] & {
  onBackdropPress?: () => void
  noGrip?: boolean
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

const BSModal: React.ForwardRefRenderFunction<
  BottomSheetModal,
  BottomSheetModalProps
> = ({ onBackdropPress, noGrip = false, ...props }, ref) => {
  const reducedMotion = useReducedMotion()
  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => {
      return <Backdrop {...backdropProps} onBackdropPress={onBackdropPress} />
    },
    [onBackdropPress]
  )

  const renderGrip = useCallback(
    (gripProps: BottomSheetHandleProps) => {
      return <Grip {...gripProps} noGrip={noGrip} />
    },
    [noGrip]
  )

  return (
    <BottomSheetModal
      ref={ref}
      handleComponent={renderGrip}
      backgroundComponent={Background}
      backdropComponent={renderBackdrop}
      animateOnMount={!reducedMotion}
      {...props}
    />
  )
}

const Grip: React.FC<BottomSheetHandleProps> = ({ noGrip }) => {
  if (noGrip) {
    return null
  }

  return (
    <View style={{ paddingTop: 8, alignItems: 'center' }}>
      <View
        style={{
          backgroundColor: Color.Grey,
          width: 40,
          height: 2,
          borderRadius: 2,
        }}
      />
    </View>
  )
}

const Background: React.FC<BottomSheetBackgroundProps> = ({ style }) => {
  return (
    <View
      pointerEvents="none"
      style={[
        style,
        {
          backgroundColor: Color.Black,
          borderTopLeftRadius: BOTTOM_SHEET_RADIUS,
          borderTopRightRadius: BOTTOM_SHEET_RADIUS,
          elevation: 10,
          borderLeftWidth: 0.1,
          borderRightWidth: 0.1,
        },
      ]}
    />
  )
}

const Backdrop: React.FC<
  BottomSheetBackdropProps & {
    onBackdropPress?: () => void
  }
> = props => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      props.animatedIndex.value,
      [-1, 0],
      [0, 0.7],
      Extrapolate.CLAMP
    ),
  }))

  const containerStyle = useMemo(
    () => [props.style, { backgroundColor: '#000' }, containerAnimatedStyle],
    [props.style, containerAnimatedStyle]
  )

  const blurStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        props.animatedIndex.value,
        [-1, 0],
        [0, 1],
        Extrapolate.CLAMP
      ),
    }),
    []
  )

  return (
    <AnimatedBlurView
      style={[props.style, blurStyle]}
      blurType="extraDark"
      blurAmount={2}
      reducedTransparencyFallbackColor={'#000'}
    />
  )
}

export default forwardRef(BSModal)
