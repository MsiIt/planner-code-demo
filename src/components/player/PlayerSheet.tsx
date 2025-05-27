import React, { forwardRef, useContext, useMemo } from 'react'
import BottomSheetModal from '../ui/bottom-sheet/BottomSheetModal'
import Text from '../ui/text/Text'
import { PlayerContext } from './player-context'
import { ImageBackground, Platform, View } from 'react-native'
import Icon from '../ui/icons/Icon'
import { Color, rgba } from '~/styles/color'
import PressableOpacity from '../ui/pressable/PressableOpacity'
import { useTranslation } from 'react-i18next'
import { useMoment } from '~/modules/hooks/use-moment'
import { isInteger } from 'lodash'
import Slider from '@react-native-community/slider'

const PlayerSheet = ({}, ref) => {
  const { t } = useTranslation()
  const moment = useMoment()

  const {
    isPlay,
    foldPlayer,
    togglePlayback,
    currentKnowledge,
    position,
    duration,
    currentRate,
    setPlayRate,
    onSliderValueChange,
  } = useContext(PlayerContext)

  const snapPoints = useMemo(() => ['93%'], [])

  const remainingTime = duration - position

  const formatTime = p => {
    const totalSeconds = Math.floor(p)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const timeMoment = moment()
      .startOf('day')
      .add(hours, 'hours')
      .add(minutes, 'minutes')
      .add(seconds, 'seconds')

    if (hours > 0) {
      return timeMoment.format('HH:mm:ss')
    } else {
      return timeMoment.format('mm:ss')
    }
  }

  const getRemainingTime = () => {
    const hours = Math.floor(remainingTime / 3600)
    const minutes = Math.floor((remainingTime % 3600) / 60)
    const seconds = remainingTime % 60

    if (remainingTime >= 3600) {
      return moment()
        .startOf('day')
        .hour(hours)
        .minute(minutes)
        .second(seconds)
        .format('HH:mm:ss')
    } else {
      return moment()
        .startOf('day')
        .minute(minutes)
        .second(seconds)
        .format('mm:ss')
    }
  }

  const thumbImage =
    Platform.OS === 'ios'
      ? require('~assets/icons/thumb-ios.png')
      : require('~assets/icons/thumb.png')

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      stackBehavior="push"
      snapPoints={snapPoints}
    >
      <ImageBackground
        source={{
          uri: currentKnowledge.image,
        }}
        style={{ flex: 1 }}
        resizeMode="cover"
        imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
      >
        <View
          style={{
            paddingTop: 24,
            paddingRight: 24,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flex: 1,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <PressableOpacity
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: rgba(Color.White, 0.1),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={foldPlayer}
          >
            <Icon name="close" />
          </PressableOpacity>
        </View>
      </ImageBackground>

      <View style={{ backgroundColor: Color.Grey }}>
        <View
          style={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: Color.Grey,
            paddingVertical: 24,
            bottom: 24,
          }}
        >
          <View style={{ gap: 4, paddingHorizontal: 24 }}>
            <Text
              style={{
                fontWeight: '400',
                fontSize: 20,
                lineHeight: 28,
                letterSpacing: -0.5,
              }}
            >
              {currentKnowledge.name ?? t(currentKnowledge.title)}
            </Text>
            {currentKnowledge.author && (
              <Text
                style={{
                  color: Color.LightGrey,
                }}
              >
                {currentKnowledge.author}
              </Text>
            )}
          </View>
          <View style={{ gap: 16, paddingHorizontal: 24 }}>
            <View style={{ gap: 12 }}>
              <PressableOpacity
                style={{
                  alignSelf: 'flex-end',
                  paddingVertical: 2,
                  paddingHorizontal: 6,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
                onPress={setPlayRate}
              >
                <Text>
                  {!isInteger(currentRate) ? currentRate : `${currentRate}.00`}x
                </Text>
              </PressableOpacity>
            </View>
          </View>
          <Slider
            value={position}
            minimumValue={0}
            maximumValue={duration}
            onSlidingComplete={onSliderValueChange}
            style={{
              height: 20,
              paddingVertical: 12,
              paddingLeft: 8,
              paddingRight: 16,
              width: '97%',
              borderRadius: 2,
            }}
            minimumTrackTintColor={Color.White}
            // thumbTintColor={Color.White}
            maximumTrackTintColor={Color.Dark}
            thumbImage={thumbImage}
          />
          <View style={{ gap: 16, paddingHorizontal: 24 }}>
            <View style={{ gap: 12 }}>
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: Color.LightGrey }}>
                    {formatTime(position)}
                  </Text>
                  <Text style={{ color: Color.LightGrey }}>
                    -{getRemainingTime()}
                  </Text>
                </View>
              </View>
            </View>

            <PressableOpacity
              style={{
                alignSelf: 'center',
                width: 68,
                height: 68,
                borderRadius: 34,
                borderWidth: 6,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                backgroundColor: Color.AccentBlue,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={togglePlayback}
            >
              <Icon name={isPlay ? 'pause' : 'play'} size={32} />
            </PressableOpacity>
          </View>
        </View>
      </View>
    </BottomSheetModal>
  )
}

export default forwardRef(PlayerSheet)
