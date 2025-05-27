import React, { PropsWithChildren, createContext, useContext } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'
import Icon from '../icons/Icon'
import PressableOpacity from '../pressable/PressableOpacity'
import { Color } from '~/styles/color'

const context = createContext(null)

type valueType = string | number | boolean

interface GroupProps {
  children?: React.ReactNode
  value?: valueType
  onValueChange?: (value: string) => void
}

const Group: React.FC<GroupProps> = ({ children, value, onValueChange }) => {
  const handleButtonPress = (value: valueType) => {
    onValueChange?.(value)
  }

  const contextValue = { value, handleButtonPress }

  return <context.Provider value={contextValue}>{children}</context.Provider>
}

interface ItemProps extends PropsWithChildren {
  value: valueType
  disabled?: boolean
  color?: string
  style?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  pressableProps?: any
  ButtonComponent?: React.FC
}

const Item: React.FC<ItemProps> = ({
  value,
  disabled,
  color,
  style,
  containerStyle,
  children,
  pressableProps = {},
  ButtonComponent,
  ...props
}) => {
  const theme = useTheme()
  const { value: selectedValue, handleButtonPress } = useContext(context)
  const checked = selectedValue === value
  const buttonColor =
    color || (checked ? theme.colors.primary : theme.colors.onSurfaceVariant)

  if (ButtonComponent) {
    return (
      <ButtonComponent
        {...props}
        mark={
          checked ? (
            <Icon
              name="radiobutton-selected"
              style={{ tintColor: buttonColor }}
            />
          ) : (
            <Icon
              name="radiobutton-unselected"
              style={{ tintColor: Color.LightGrey }}
            />
          )
        }
        onPress={() => handleButtonPress(value)}
      >
        {children}
      </ButtonComponent>
    )
  }

  return (
    <PressableOpacity
      disabled={disabled}
      containerStyle={containerStyle}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
        },
        style,
      ]}
      onPress={() => handleButtonPress(value)}
      {...pressableProps}
    >
      <View style={{ flexShrink: 0 }}>
        {checked ? (
          <Icon
            name="radiobutton-selected"
            style={{ tintColor: buttonColor }}
          />
        ) : (
          <Icon name="radiobutton-unselected" />
        )}
      </View>

      <View style={{ marginLeft: 8, flex: 1 }}>{children}</View>
    </PressableOpacity>
  )
}

const RadioButton = { Group, Item }
export default RadioButton
