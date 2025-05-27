import _ from 'lodash'
import React, { useCallback, useRef } from 'react'
import { Linking, View } from 'react-native'
import Pdf from 'react-native-pdf'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScreenComponent } from '~/@types/utils'
import Icon from '~/components/ui/icons/Icon'
import Pressable from '~/components/ui/pressable/Pressable'
import { useObject, useRealm } from '~/db'
import { Book } from '~/db/models/book'
import { Color } from '~/styles/color'
import { assert } from '~/utils/assertion'

const ReaderScreen: ScreenComponent = ({ route, navigation }) => {
  const realm = useRealm()
  const bookId = route.params?.bookId as number
  assert(bookId)

  const book = useObject(Book, bookId)
  assert(book && book.localData.fileUri)

  const hadlePageChange = useCallback(
    _.throttle(page => {
      realm.write(() => {
        book.localData.currentPage = page
      })
    }, 1000),
    []
  )

  const initialPage = useRef(book.localData.currentPage ?? 1)

  const goBack = () => {
    navigation.goBack()
  }

  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1 }}>
      <Pdf
        source={{ uri: book.localData.fileUri }}
        page={initialPage.current}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`)
        }}
        onPageChanged={(page, numberOfPages) => {
          hadlePageChange(page)
        }}
        onError={error => {
          console.log(error)
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`)
          Linking.openURL(uri)
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      <Pressable
        containerStyle={{
          position: 'absolute',
          right: 10 + insets.right,
          top: 10 + insets.top,
        }}
        style={{
          padding: 5,
          borderRadius: 99,
          backgroundColor: Color.Grey,
        }}
        hitSlop={15}
        onPress={goBack}
      >
        <Icon name="close" />
      </Pressable>
    </View>
  )
}

export default ReaderScreen
