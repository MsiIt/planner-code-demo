import React from 'react'
import { View, ViewProps } from 'react-native'
import { Color } from '~/styles/color'
import Pressable from '../pressable/Pressable'

const Surface: React.FC<ViewProps | Parameters<typeof Pressable>[0]> = ({
  style,
  onPress,
  containerStyle,
  ...props
}) => {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        containerStyle={containerStyle}
        style={[
          { padding: 16, backgroundColor: Color.Dark, borderRadius: 8 },
          style,
        ]}
        {...props}
      />
    )
  }

  return (
    <View
      style={[
        { padding: 16, backgroundColor: Color.Dark, borderRadius: 8 },
        containerStyle,
        style,
      ]}
      {...props}
    />
  )
}

export default Surface
