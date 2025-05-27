import React from 'react'
import { PressableProps } from '../pressable/Pressable'
import { Color } from '~/styles/color'
import Text from '../text/Text'
import PressableOpacity from '../pressable/PressableOpacity'

interface ButtonProps extends PressableProps {
  title?: string
}

const PlainButton: React.FC<ButtonProps> = ({
  title,
  children,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <PressableOpacity
      hitSlop={20}
      {...props}
      containerStyle={[{}, containerStyle]}
      style={[{ alignItems: 'center' }, style]}
    >
      {children ? (
        children
      ) : (
        <Text style={{ color: Color.LightGrey }}>{title}</Text>
      )}
    </PressableOpacity>
  )
}

export default PlainButton
