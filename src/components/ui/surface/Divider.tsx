import React from 'react'
import { View } from 'react-native'
import { Color } from '~/styles/color'

const Divider = ({ color = Color.Grey, style = {} }) => (
  <View
    style={[{ height: 1, backgroundColor: color, marginHorizontal: 12 }, style]}
  />
)

export default Divider
