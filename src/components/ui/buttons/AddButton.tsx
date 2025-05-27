import React from 'react'
import { Color } from '~/styles/color'
import Icon from '../icons/Icon'
import Surface from '../surface/Surface'
import Text from '../text/Text'

const AddButton = ({ title, onPress }) => {
  return (
    <Surface
      style={{
        backgroundColor: undefined,
        borderWidth: 1,
        padding: 15,
        borderStyle: 'dashed',
        borderColor: Color.AccentBlue,
        flexDirection: 'row',
        justifyContent: 'center',
      }}
      onPress={onPress}
    >
      <Icon name="plus" style={{ tintColor: Color.AccentBlue }} />
      <Text style={{ marginLeft: 8, color: Color.AccentBlue }}>{title}</Text>
    </Surface>
  )
}

export default AddButton
