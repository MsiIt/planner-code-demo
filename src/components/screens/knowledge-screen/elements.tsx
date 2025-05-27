import React from 'react'
import { BlurView } from '@react-native-community/blur'
import Icon from '~/components/ui/icons/Icon'
import { Platform, View } from 'react-native'
import { Color, rgba } from '~/styles/color'
import { FontFamily } from '~/styles/typography'
import Text from '~/components/ui/text/Text'
import { Image } from 'react-native'

export const KnowledgeLockIndicator = ({ type }) => {
  // if (Platform.OS === 'ios') {
  //   return (
  //     <BlurView
  //       blurAmount={8}
  //       pointerEvents="none"
  //       blurType="ultraThinMaterialDark"
  //       style={{
  //         position: 'absolute',
  //         top: 8,
  //         right: 8,
  //         padding: 4,
  //         borderRadius: 8,
  //       }}
  //     >
  //       <Icon name="lock" />
  //     </BlurView>
  //   )
  // }

  return (
    <Image
      source={require('~assets/images/boost-lock.png')}
      style={{
        width: 46,
        height: 12,
        position: 'absolute',
        top: type === 'book' ? 4 : 8,
        right: type === 'book' ? 4 : 8,
      }}
    />
    // <View
    //   pointerEvents="none"
    //   style={{
    //     position: 'absolute',
    //     top: 8,
    //     right: 8,
    //     padding: 4,
    //     borderRadius: 8,
    //     backgroundColor: rgba(Color.Grey, 0.3),
    //   }}
    // >
    //   <Icon name="lock" />
    // </View>
  )
}
