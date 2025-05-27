import React, { useCallback, useMemo, useRef } from 'react'
import BottomSheetModal from '../ui/bottom-sheet/BottomSheetModal'
import { W_H_PADDING } from '~/styles'
import {
  BottomSheetScrollView,
  BottomSheetModal as BSModal,
} from '@gorhom/bottom-sheet'
import Text from '../ui/text/Text'
import Surface from '../ui/surface/Surface'
import Icon from '../ui/icons/Icon'
import { Color } from '~/styles/color'
import { useQuery } from '~/db'
import { View } from 'react-native'
import { Category } from '~/db/models/category'

const CategorySelector = ({
  placeholder,
  category,
  onSelect,
}: {
  placeholder?: string
  category?: Category
  onSelect: (g?: Category) => void
}) => {
  const categories = useQuery(Category)

  const bottomSheetModalRef = useRef<BSModal>(null)
  const snapPoints = useMemo(() => ['60%'], [])
  const open = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])
  const close = useCallback(() => {
    bottomSheetModalRef.current?.close()
  }, [])

  const select = (category?: Category) => {
    close()
    onSelect?.(category)
  }

  return (
    <>
      <Surface
        style={{
          paddingVertical: 11,
          backgroundColor: Color.Transparent,
          borderColor: Color.Grey,
          borderWidth: 1,
          flexDirection: 'row',
        }}
        onPress={open}
      >
        <Text
          numberOfLines={1}
          style={[{ flex: 1 }, !category && { color: Color.LightGrey }]}
        >
          {category ? category.name : placeholder}
        </Text>
        <Icon name="chevron-down" style={{ marginLeft: 8 }} />
      </Surface>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        stackBehavior="push"
        onBackdropPress={close}
      >
        <BottomSheetScrollView
          bounces={false}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 20,
            paddingHorizontal: W_H_PADDING,
          }}
        >
          {!!placeholder && (
            <Item
              name={placeholder}
              selected={!category}
              textStyle={[category && { color: Color.LightGrey }]}
              onPress={() => select()}
            />
          )}
          {categories.map(c => {
            const id = c.id
            return (
              <View key={id} style={{ marginTop: 8 }}>
                <Item
                  name={c.name}
                  selected={category && category.id === id}
                  onPress={() => select(c)}
                />
              </View>
            )
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  )
}

const Item = ({ name, selected, textStyle = {}, onPress }) => {
  return (
    <Surface
      style={[selected && { backgroundColor: Color.AccentBlue }]}
      onPress={onPress}
    >
      <Text style={textStyle} numberOfLines={1}>
        {name}
      </Text>
    </Surface>
  )
}

export default CategorySelector
