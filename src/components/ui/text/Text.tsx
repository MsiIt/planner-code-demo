import React from 'react'
import { Text as RNText, TextProps } from 'react-native'
import { Color } from '~/styles/color'
import { FontFamily } from '~/styles/typography'

const Text: React.FC<TextProps> = ({ style, ...props }) => {
  return (
    <RNText
      style={[
        {
          fontFamily: FontFamily.Primary,
          color: Color.White,
          fontSize: 14,
          lineHeight: 20,
        },
        style,
      ]}
      {...props}
    />
  )
}

export { Text as RNText } from 'react-native'
export default Text
