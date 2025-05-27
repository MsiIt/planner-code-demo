import React, { useContext } from 'react'
import PressableOpacity from '../ui/pressable/PressableOpacity'
import { Color } from '~/styles/color'
import { Image, View } from 'react-native'
import Text from '../ui/text/Text'
import Icon from '../ui/icons/Icon'
import { PlayerContext } from './player-context'
import PlayerSheet from './PlayerSheet'
import { useTranslation } from 'react-i18next'

const FoldedPlayer = () => {
  const {
    playerSheetRef,
    isPlay,
    presentPlayer,
    closePlayer,
    togglePlayback,
    currentKnowledge,
    position,
    duration,
  } = useContext(PlayerContext)

  const { t } = useTranslation()
  const percentagePassed = (position / duration) * 100

  return (
    <>
      <PressableOpacity
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          paddingBottom: 8,
          gap: 8,
          backgroundColor: Color.Black,
          borderBottomWidth: 1,
          borderBottomColor: Color.Grey,
        }}
        onPress={presentPlayer}
        isFoldedPlayer={true}
      >
        <View
          style={{
            height: 2,
            backgroundColor: Color.Dark,
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              backgroundColor: Color.White,
              width: `${percentagePassed}%`,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            gap: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              flex: 1,
            }}
          >
            {currentKnowledge?.image && (
              <Image
                source={{ uri: currentKnowledge.image }}
                width={40}
                height={40}
                style={{ borderRadius: 4 }}
              />
            )}

            <View>
              {currentKnowledge.name && (
                <Text>
                  {currentKnowledge.name.length <= 30
                    ? currentKnowledge.name
                    : `${currentKnowledge.name.substring(0, 30).trim()}...`}
                </Text>
              )}
              {currentKnowledge.title && (
                <Text>
                  {t(currentKnowledge.title).length <= 30
                    ? t(currentKnowledge.title)
                    : `${t(currentKnowledge.title).substring(0, 30).trim()}...`}
                </Text>
              )}
              {currentKnowledge.author && (
                <Text
                  style={{
                    fontWeight: '400',
                    fontSize: 12,
                    lineHeight: 16,
                    color: Color.LightGrey,
                  }}
                >
                  {currentKnowledge.author.length <= 35
                    ? currentKnowledge.author
                    : `${currentKnowledge.author.substring(0, 35).trim()}...`}
                </Text>
              )}
            </View>
          </View>

          <PressableOpacity
            style={{ width: 26, height: 26 }}
            onPress={closePlayer}
          >
            <Icon name="close" size={26} />
          </PressableOpacity>

          <PressableOpacity
            style={{ width: 26, height: 26 }}
            onPress={togglePlayback}
          >
            <Icon name={isPlay ? 'pause' : 'play'} size={26} />
          </PressableOpacity>
        </View>
      </PressableOpacity>

      <PlayerSheet ref={playerSheetRef} />
    </>
  )
}

export default FoldedPlayer
