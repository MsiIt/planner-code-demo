import React, { forwardRef } from 'react'
import { Platform, TextInputProps } from 'react-native'
import { Color } from '~/styles/color'
import TextInput from '../inputs/TextInput'

const TextField: React.ForwardRefRenderFunction<
  any,
  TextInputProps & {
    InputComponent?: React.Component
    error?: string | boolean
  }
> = ({ InputComponent, style, error, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      InputComponent={InputComponent}
      placeholderTextColor={Color.LightGrey}
      {...props}
      style={[
        {
          paddingHorizontal: 15, // 16-1
          borderWidth: 1,
          borderRadius: 8,
          ...Platform.select({
            ios: {
              minHeight: 44,
              paddingBottom: 3,
              paddingTop: props.multiline ? 7.5 : 0,
            },
            default: { paddingVertical: 7.5 },
          }),
          borderColor: Color.Grey,
        },
        style,
        error && { borderColor: Color.AccentRed },
      ]}
    />
  )
}

export default forwardRef(TextField)
