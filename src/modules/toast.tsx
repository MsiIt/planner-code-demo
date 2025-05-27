import React from 'react'
import { View } from 'react-native'
import RNToast from 'react-native-toast-message'
import Text from '~/components/ui/text/Text'
import { Color } from '~/styles/color'

export const Toast = RNToast

const toastConfig = {
  info: ({ text1, props }) => (
    <View
      style={{
        paddingVertical: 16,
        paddingHorizontal: 24,
        width: 'auto',
        backgroundColor: Color.Grey,
        borderRadius: 8,
      }}
    >
      <Text>{text1}</Text>
    </View>
  ),
}

export const ToastService = () => {
  return <RNToast config={toastConfig} visibilityTime={3000} />
}
