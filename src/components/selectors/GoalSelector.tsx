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
import { Goal } from '~/db/models/goal'
import { View } from 'react-native'

const GoalSelector = ({
  placeholder,
  goal,
  onSelect,
}: {
  placeholder: string
  goal?: Goal
  onSelect: (g?: Goal) => void
}) => {
  const goals = useQuery(Goal).filtered('active = true')

  const bottomSheetModalRef = useRef<BSModal>(null)
  const snapPoints = useMemo(() => ['60%'], [])
  const open = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])
  const close = useCallback(() => {
    bottomSheetModalRef.current?.close()
  }, [])

  const select = (goal?: Goal) => {
    close()
    onSelect?.(goal)
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
          style={[{ flex: 1 }, !goal && { color: Color.LightGrey }]}
        >
          {goal ? goal.name : placeholder}
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
          <Item
            name={placeholder}
            selected={!goal}
            textStyle={[goal && { color: Color.LightGrey }]}
            onPress={() => select()}
          />
          {goals.map(g => {
            const id = g.id
            return (
              <View key={id} style={{ marginTop: 8 }}>
                <Item
                  name={g.name}
                  selected={goal && goal.id === id}
                  onPress={() => select(g)}
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

export default GoalSelector
