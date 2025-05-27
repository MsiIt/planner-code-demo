import React from 'react'
import {
  Platform,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import PressableOpacity from './PressableOpacity'
import { getInsets } from '~/utils/react-native'
import { Color } from '~/styles/color'

interface AndroidComponentProps extends RNPressableProps {
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  foregroundRipple?: boolean
}

const AndroidComponent: React.FC<AndroidComponentProps> = ({
  children,
  containerStyle,
  style: rawStyle,
  hitSlop,
  foregroundRipple,
  ...props
}) => {
  const {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    ...style
  } = StyleSheet.flatten<ViewStyle>(rawStyle) ?? {}

  const borderRadiusStyle = {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  }

  return (
    <View
      style={[containerStyle, { overflow: 'hidden' }, borderRadiusStyle]}
      hitSlop={getInsets(hitSlop)}
    >
      <RNPressable
        android_ripple={{ color: Color.White, foreground: foregroundRipple }}
        style={[style, borderRadiusStyle]}
        hitSlop={hitSlop}
        {...props}
      >
        {children}
      </RNPressable>
    </View>
  )
}

interface DefaultComponentProps extends RNPressableProps {
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}

const DefaultComponent: React.FC<DefaultComponentProps> = ({
  children,
  ...props
}) => <PressableOpacity {...props}>{children}</PressableOpacity>

const Component =
  Platform.OS === 'android' ? AndroidComponent : DefaultComponent

export type PressableProps = AndroidComponentProps & DefaultComponentProps

/**
 * todo: check for ios
 */
const Pressable: React.FC<PressableProps> = ({ children, ...props }) => {
  return <Component {...props}>{children}</Component>
}

export default Pressable
