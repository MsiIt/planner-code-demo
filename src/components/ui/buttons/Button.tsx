import React from 'react'
import Pressable, { PressableProps } from '../pressable/Pressable'
import { Color } from '~/styles/color'
import Text from '../text/Text'
import { TextStyle } from 'react-native'

interface ButtonProps extends PressableProps {
  title?: string
  titleStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  title,
  children,
  containerStyle,
  style,
  titleStyle,
  ...props
}) => {
  return (
    <Pressable
      {...props}
      containerStyle={[{}, containerStyle]}
      style={[
        {
          padding: 11,
          borderWidth: 1,
          borderColor: Color.AccentBlue,
          borderRadius: 8,
          alignItems: 'center',
        },
        style,
      ]}
    >
      {children ? (
        children
      ) : (
        <Text style={[{ textAlign: 'center' }, titleStyle]}>{title}</Text>
      )}
    </Pressable>
  )
}

export default Button
