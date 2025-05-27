import React from 'react'
import { View, ViewProps } from 'react-native'
import Icon from '~/components/ui/icons/Icon'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import Text from '~/components/ui/text/Text'
import { TaskType } from '~/constants'
import { Color } from '~/styles/color'

export const signTextByTaskType = {
  [TaskType.Gratitude]: 'task.gratitude.sign',
  [TaskType.DayAnalysis]: 'task.day-analysis.sign',
  [TaskType.Achievement]: 'task.achivement-of-the-day.sign',
  [TaskType.GoalReading]: 'task.read-and-check.sign',
}

export const Section: React.FC<ViewProps> = ({ style, children, ...props }) => {
  return (
    <View
      {...props}
      style={[{ paddingHorizontal: 12, paddingVertical: 10 }, style]}
    >
      {children}
    </View>
  )
}

export const Checkbox = ({
  label,
  checked = false,
  style = {},
  labelStyle = {},
  onCheck,
}) => {
  return (
    <View style={[{ flexDirection: 'row' }, style]}>
      <PressableOpacity
        hitSlop={20}
        disabled={!onCheck}
        containerStyle={{ zIndex: 2 }}
        onPress={onCheck}
      >
        <Icon
          name={checked ? 'checkbox-checked' : 'checkbox-unchecked'}
          style={{ tintColor: Color.LightGrey }}
        />
      </PressableOpacity>
      <Text
        style={[
          { marginLeft: 8, flex: 1 },
          checked && {
            textDecorationLine: 'line-through',
            color: Color.LightGrey,
          },
          labelStyle,
        ]}
        numberOfLines={3}
      >
        {label}
      </Text>
    </View>
  )
}

export const EffectSign = ({ text }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: Color.AccentBlue,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      }}
    >
      <Text style={{ fontSize: 12, lineHeight: 16 }}>{text}</Text>
    </View>
  )
}
