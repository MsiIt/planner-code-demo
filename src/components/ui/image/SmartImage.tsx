import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import {
  Image,
  ImageProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { Color, rgba } from '~/styles/color'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

interface Props {
  uri: string
  containerStyle?: StyleProp<ViewStyle>
}

type SmartImageProps = Omit<ImageProps, 'source'> & PropsWithChildren<Props>

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)

const SmartImage: React.FC<SmartImageProps> = ({
  uri,
  containerStyle,
  style,
  ...props
}) => {
  const [error, setError] = useState(false)

  const fade = useSharedValue(0)
  const mountedAt = useRef(Date.now())

  const onLoad = () => {
    props.onLoad?.()

    if (Date.now() - mountedAt.current > 200) {
      fade.value = withTiming(1, {
        duration: 200,
        reduceMotion: ReduceMotion.Never,
      })
    } else {
      fade.value = 1
    }
  }

  const imageStyle = useAnimatedStyle(() => {
    return { opacity: fade.value }
  }, [])

  useEffect(() => {
    setError(false)
  }, [uri])

  if (error) {
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        colors={[rgba(Color.Black, 0.7), rgba(Color.Black, 0)]}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: Color.Dark,
            overflow: 'hidden',
            flexDirection: 'row',
          },
          style,
        ]}
      >
        {/* {[0, 1, 2].map((_, x) => {
          return (
            <View key={x}>
              {[0, 1, 2].map((_, y) => {
                return (
                  <Image
                    key={y}
                    source={require('~assets/images/no-image.png')}
                    style={{ width: 280, height: 280 }}
                  />
                )
              })}
            </View>
          )
        })} */}
        <Image
          source={require('~assets/images/no-image.png')}
          style={{ width: '100%', height: '100%' }}
        />
      </LinearGradient>
    )
  }

  return (
    <View style={containerStyle}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        colors={[rgba(Color.Black, 0.7), rgba(Color.Black, 0)]}
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: style?.borderRadius, backgroundColor: Color.Dark },
        ]}
      />
      <AnimatedFastImage
        {...props}
        source={{ uri }}
        style={[imageStyle, { width: '100%', height: '100%' }, style]}
        onLoad={onLoad}
        onError={() => {
          props.onError?.()
          setError(true)
        }}
      />
    </View>
  )
}

export default SmartImage
