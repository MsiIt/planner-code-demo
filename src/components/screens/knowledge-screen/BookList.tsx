import React, { useContext } from 'react'
import { ScrollView, View, useWindowDimensions } from 'react-native'
import { BooksService } from '~/services/books-service'
import { StoriesService, Story } from '~/components/stories-service'
import Icon from '~/components/ui/icons/Icon'
import Pressable from '~/components/ui/pressable/Pressable'
import Text from '~/components/ui/text/Text'
import { useQuery, useRealm } from '~/db'
import { Book } from '~/db/models/book'
import { W_H_PADDING } from '~/styles'
import { Color } from '~/styles/color'
import SmartImage from '~/components/ui/image/SmartImage'
import { useSelector } from '~/store/utils'
import { KnowledgeLockIndicator } from './elements'
import { useTranslation } from 'react-i18next'
import { PlayerContext } from '~/components/player/player-context'

const baseWidth = 264
const gap = 16

function calculateSize(wWidth, baseWidth, hPadding, gap) {
  // Вычисляем максимальное количество элементов, которое может поместиться на экране
  const maxElements = (wWidth - hPadding) / (baseWidth + gap)
  let size = baseWidth

  const decimal = maxElements % 1
  if (decimal > 0.9) {
    size -= 15
  } else if (decimal < 0.1) {
    size += 15
  }

  return size
}

const BookList = () => {
  const wWidth = useWindowDimensions().width
  const size = calculateSize(wWidth, baseWidth, 24, gap)

  const books = useQuery(Book).sorted('limited')

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: W_H_PADDING }}
    >
      {books.map((item, i) => {
        return (
          <View key={i} style={[i > 0 && { marginLeft: gap }]}>
            <BookKnowledgeItem item={item} size={size} />
          </View>
        )
      })}
    </ScrollView>
  )
}

export const BookVerticalList = ({ onRequestClose }) => {
  const books = useQuery(Book).sorted('limited')

  return (
    <View style={{ paddingHorizontal: W_H_PADDING }}>
      {books.map((item, i) => {
        return (
          <View key={i} style={[i > 0 && { marginTop: 16 }]}>
            <BookKnowledgeItem
              item={item}
              size="auto"
              onBookRead={onRequestClose}
            />
          </View>
        )
      })}
    </View>
  )
}

const BookKnowledgeItem = ({
  item,
  size,
  onBookRead,
}: {
  item: Book
  size: number | string
  onBookRead?: (book: Book) => void
}) => {
  const { t } = useTranslation()
  const isSubscribed = useSelector(s => s.iap.isSubscribed)
  const realm = useRealm()

  const { openPlayer, setKnowledge, setAudioLink } = useContext(PlayerContext)

  const onBookPress = () => {
    setKnowledge(item)
    // test audio, delete
    // setAudioLink('https://mtplanner.store/storiesMedia/1-1.mp3')
    if (item.audio) {
      setAudioLink(item.audio)
    }
    const b = item
    StoriesService.show([
      {
        id: 1,
        headTitle: b.name,
        imageSrc: { uri: b.image },
        backgroundColor: b.storyBackgroundColor,
        title: b.name,
        text: b.description,
      },
      {
        id: 2,
        headTitle: b.name,
        imageSrc: {
          uri: `https://mtplanner.store/bookReviews/${b.id}/story.1.jpg`,
        },
        limited: !isSubscribed && b.limited,
        buttons: b.audio
          ? [
              {
                text: t('knowledge.story.audio.listen.button'),
                onPress: () => {
                  openPlayer?.(b, b.audio)
                },
              },
              {
                text: t('knowledge.read-book'),
                onPress: () => {
                  realm.write(() => {
                    onBookRead?.(item)
                    new BooksService(realm).read(b)
                  })
                },
              },
            ]
          : [
              {
                text: t('knowledge.read-book'),
                onPress: () => {
                  realm.write(() => {
                    onBookRead?.(item)
                    new BooksService(realm).read(b)
                  })
                },
              },
            ],
      },
    ])
  }

  return (
    <Pressable
      style={{ borderRadius: 16 }}
      foregroundRipple
      onPress={onBookPress}
    >
      <View
        style={{
          width: size,
          height: size === 'auto' ? 128 : (128 / 264) * size,
          padding: 8,
          flexDirection: 'row',
          backgroundColor: Color.Dark,
        }}
      >
        <View>
          <SmartImage
            uri={item.image}
            containerStyle={{
              aspectRatio: 84 / 112,
              width: size === 'auto' ? undefined : (84 / baseWidth) * size,
              height: size === 'auto' ? '100%' : (112 / baseWidth) * size,
            }}
            style={{ borderRadius: 8 }}
          />
          {!isSubscribed && item.limited && (
            <KnowledgeLockIndicator type="book" />
          )}
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text numberOfLines={2}>{item.name}</Text>

          <View
            style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}
          >
            <Icon name="clock-small" size={14} />
            <Text style={{ marginLeft: 4, fontSize: 12, lineHeight: 16 }}>
              {item.readingLength} минут
            </Text>

            {item.audio && (
              <>
                <Icon style={{ marginLeft: 12 }} name="play" size={14} />
                <Text style={{ marginLeft: 4, fontSize: 12, lineHeight: 16 }}>
                  {t('knowledge.story.audio')}
                </Text>
              </>
            )}
          </View>

          <Text
            numberOfLines={2}
            style={{
              marginTop: 8,
              fontSize: 12,
              lineHeight: 16,
              color: Color.LightGrey,
            }}
          >
            {item.description}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default BookList
