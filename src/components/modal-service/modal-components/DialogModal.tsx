import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { View } from 'react-native'
import Icon from '~/components/ui/icons/Icon'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import Divider from '~/components/ui/surface/Divider'
import Surface from '~/components/ui/surface/Surface'
import Text from '~/components/ui/text/Text'
import { W_H_PADDING } from '~/styles'
import { BlurView } from '@react-native-community/blur'
import { Color } from '~/styles/color'

interface Props {
  title: string
  renderBody?: () => React.JSX.Element
  renderFooter?: () => React.JSX.Element
  onResolve: (result: unknown) => any
  onReject: (reason: unknown) => any
}

const DialogModal: React.FC<Props> = ({
  title,
  renderBody,
  renderFooter,
  onResolve,
  onReject,
}) => {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: W_H_PADDING,
        justifyContent: 'center',
      }}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => onReject(new Error('closed'))}
      >
        {/* <View style={{ height: '100%', backgroundColor: '#00000099' }} /> */}
        <BlurView
          blurType="extraDark"
          blurAmount={2}
          reducedTransparencyFallbackColor={'#000'}
          style={{ height: '100%' }}
        />
      </Pressable>

      <Surface style={{ padding: 0 }}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 12,
          }}
        >
          <Text style={{ flex: 1 }}>{title}</Text>

          <PressableOpacity
            containerStyle={{ marginLeft: 8 }}
            hitSlop={15}
            onPress={() => onReject(new Error('closed'))}
          >
            <Icon name="close" />
          </PressableOpacity>
        </View>

        {renderBody && (
          <>
            <Divider />
            <View style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
              {renderBody()}
            </View>
          </>
        )}
        {renderFooter && (
          <>
            <Divider />
            <View style={{ padding: 12 }}>{renderFooter()}</View>
          </>
        )}
      </Surface>
    </View>
  )
}

export default DialogModal
