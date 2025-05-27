import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'
import { StoriesService } from '~/components/stories-service'
import SmartImage from '~/components/ui/image/SmartImage'
import Pressable from '~/components/ui/pressable/Pressable'
import Text from '~/components/ui/text/Text'
import {
  KnowledgeListItem,
  StoryGroupSource,
  transformStoryGroupSource,
} from '~/modules/knowledge'
import { useSelector } from '~/store/utils'
import { W_H_PADDING } from '~/styles'
import { KnowledgeLockIndicator } from './elements'
import { PlayerContext } from '~/components/player/player-context'

const baseWidth = 152
const gap = 16

function calculateSize(wWidth, baseWidth = 152, hPadding = 24, gap = 16) {
  // Вычисляем максимальное количество элементов, которое может поместиться на экране
  const maxElements = (wWidth - hPadding) / (baseWidth + gap)
  let size = baseWidth

  const decimal = maxElements % 1
  if (decimal > 0.85 || decimal < 0.1) {
    size -= 15
  }

  return size
}

const KnowledgeList = ({ items }: { items: StoryGroupSource[] }) => {
  const wWidth = useWindowDimensions().width
  const size = calculateSize(wWidth, baseWidth, 24, gap)

  const { setKnowledge, setAudioLink } = useContext(PlayerContext)

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: W_H_PADDING }}
    >
      {items.map((item, i) => {
        const itemData = transformStoryGroupSource(item)

        return (
          <View key={i} style={[i > 0 && { marginLeft: gap }]}>
            <KnowledgeItem
              item={itemData}
              size={size}
              onPress={() => {
                setKnowledge(itemData)
                if (itemData.audio) {
                  setAudioLink(itemData.audio)
                }
                StoriesService.show(itemData.stories)
              }}
            />
          </View>
        )
      })}
    </ScrollView>
  )
}

const minItemSize = 154
export const KnowledgeGrid = ({ items }: { items: StoryGroupSource[] }) => {
  const wWidth = useWindowDimensions().width

  const { setKnowledge, setAudioLink } = useContext(PlayerContext)

  const { itemsInRow, size } = (() => {
    let itemsInRow = 1

    const calcSize = (count: number) => {
      const availableSpace = wWidth - W_H_PADDING * 2 - (count - 1) * 16
      return availableSpace / count
    }

    while (calcSize(itemsInRow) > minItemSize) {
      if (calcSize(itemsInRow + 1) > minItemSize) {
        itemsInRow++
      } else {
        break
      }
    }

    return { itemsInRow, size: calcSize(itemsInRow) }
  })()

  return (
    <View
      style={{ flexDirection: 'row', flexWrap: 'wrap', padding: W_H_PADDING }}
    >
      {items.map((item, i) => {
        const itemData = transformStoryGroupSource(item)

        return (
          <View
            key={i}
            style={[
              !!(i % itemsInRow) && { marginLeft: 16 },
              i > itemsInRow - 1 && { marginTop: 16 },
            ]}
          >
            <KnowledgeItem
              item={itemData}
              size={size}
              style={{ borderRadius: 8 }}
              onPress={() => {
                setKnowledge(itemData)
                if (itemData.audio) {
                  setAudioLink(itemData.audio)
                }
                StoriesService.show(itemData.stories)
              }}
            />
          </View>
        )
      })}
    </View>
  )
}

const KnowledgeItem = ({
  item,
  size,
  style,
  onPress,
}: {
  item: KnowledgeListItem
  size: number
  style?: ViewStyle
  onPress: () => void
}) => {
  const isSubscribed = useSelector(s => s.iap.isSubscribed)
  const { t } = useTranslation()

  const [useDefaultTextColor, setUseDefaultTextColor] = useState(false)

  return (
    <Pressable
      style={[{ borderRadius: 16 }, style]}
      foregroundRipple
      onPress={onPress}
    >
      <View
        style={{
          width: size,
          height: size,
          paddingVertical: 12,
          paddingHorizontal: 16,
          justifyContent: 'flex-end',
        }}
      >
        <SmartImage
          uri={item.thumbnailUri}
          onError={() => {
            setUseDefaultTextColor(true)
          }}
          containerStyle={StyleSheet.absoluteFill}
          style={{ resizeMode: 'cover' }}
        />
        {!isSubscribed && item.limited && (
          <KnowledgeLockIndicator type="knowledge" />
        )}
        <Text
          style={
            item.previewTextColor &&
            !useDefaultTextColor && { color: item.previewTextColor }
          }
        >
          {t(item.title)}
        </Text>
      </View>
    </Pressable>
  )
}

export default KnowledgeList
