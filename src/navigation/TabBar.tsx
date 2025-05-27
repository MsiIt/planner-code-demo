import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useContext, useEffect, useRef } from 'react'
import { Keyboard, Platform, StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Icon from '~/components/ui/icons/Icon'
import Pressable from '~/components/ui/pressable/Pressable'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import Text from '~/components/ui/text/Text'
import { Color } from '~/styles/color'
import TaskFormSheet from '~/components/sheets/TaskFormSheet'
import { navigationStore } from './navigation-store'
import { observer } from 'mobx-react-lite'
import CategoryFormSheet from '~/components/sheets/CategoryFormSheet'
import GoalFormSheet from '~/components/sheets/GoalFormSheet'
import CategorySheet from '~/components/sheets/CategorySheet'
import AITaskSheet from '~/components/sheets/AITaskSheet'
import FoldedPlayer from '~/components/player/FoldedPlayer'
import { PlayerContext } from '~/components/player/player-context'

const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { isActivePlayer } = useContext(PlayerContext)

  const focusedOptions = descriptors[state.routes[state.index].key].options
  const visibleValue = useSharedValue(1)

  const tabBarHeight = 68

  useEffect(() => {
    const onShow = () => {
      visibleValue.value = withTiming(0, { duration: 150 })
    }
    const onHide = () => {
      visibleValue.value = withTiming(1, { duration: 150 })
    }

    const androidHandler = () => {
      const s1 = Keyboard.addListener('keyboardDidShow', onShow)
      const s2 = Keyboard.addListener('keyboardDidHide', onHide)

      return () => {
        s1.remove()
        s2.remove()
      }
    }

    const iosHandler = () => {
      const s1 = Keyboard.addListener('keyboardWillShow', onShow)
      const s2 = Keyboard.addListener('keyboardWillHide', onHide)

      return () => {
        s1.remove()
        s2.remove()
      }
    }

    return Platform.select({ ios: iosHandler, default: androidHandler })()
  }, [])

  const underlayStyle = useAnimatedStyle(
    () =>
      focusedOptions.tabBarHideOnKeyboard
        ? { height: visibleValue.value * tabBarHeight }
        : { height: tabBarHeight },
    [tabBarHeight, focusedOptions.tabBarHideOnKeyboard]
  )
  const barStyle = useAnimatedStyle(
    () =>
      focusedOptions.tabBarHideOnKeyboard
        ? { top: (1 - visibleValue.value) * 8 }
        : { top: 0 },
    [focusedOptions.tabBarHideOnKeyboard]
  )

  const categoryRef = useRef()
  const categoryFromRef = useRef()
  const goalFromRef = useRef()
  const taskFormRef = useRef()
  const aiTaskRef = useRef()

  useEffect(() => {
    navigationStore.setCategoryFormRef(categoryFromRef)
    navigationStore.setGoalFormRef(goalFromRef)
    navigationStore.setCategoryRef(categoryRef)
    navigationStore.setTaskFormRef(taskFormRef)
    navigationStore.setAiTaskRef(aiTaskRef)
  }, [])

  return (
    <View>
      {isActivePlayer && <FoldedPlayer />}
      <Animated.View
        style={[underlayStyle, { backgroundColor: Color.Black }]}
      />

      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 68,
            flexDirection: 'row',
          },
          barStyle,
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <React.Fragment key={route.name}>
              <View
                style={[
                  styles.buttonContainer,
                  {
                    backgroundColor: isFocused
                      ? options?.tabBarActiveBackgroundColor
                      : options?.tabBarInactiveBackgroundColor,
                  },
                ]}
              >
                <PressableOpacity
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  containerStyle={styles.buttonContainer}
                  style={styles.buttonItem}
                >
                  <View>
                    {options?.tabBarIcon({
                      focused: isFocused,
                      color: isFocused
                        ? options?.tabBarActiveTintColor
                        : options?.tabBarInactiveTintColor,
                      size: 24,
                    })}
                  </View>
                  {!!options?.tabBarLabel && (
                    <View style={{ marginTop: 4 }}>
                      <Text
                        style={[
                          {
                            fontSize: 12,
                            lineHeight: 16,
                            color: isFocused
                              ? options?.tabBarActiveTintColor
                              : options?.tabBarInactiveTintColor,
                          },
                          options?.tabBarLabelStyle,
                        ]}
                      >
                        {options?.tabBarLabel}
                      </Text>
                    </View>
                  )}
                </PressableOpacity>
              </View>

              {index === 1 && (
                <View style={{ paddingHorizontal: 8 }}>
                  <Pressable
                    containerStyle={{ top: -8 }}
                    style={{
                      padding: 16,
                      borderRadius: 50,
                      backgroundColor: Color.AccentBlue,
                    }}
                    onPress={() => taskFormRef.current.open()}
                  >
                    <Icon name="plus" />
                  </Pressable>
                </View>
              )}
            </React.Fragment>
          )
        })}
      </Animated.View>

      <CategorySheet ref={categoryRef} />
      <CategoryFormSheet ref={categoryFromRef} />
      <GoalFormSheet ref={goalFromRef} />
      <TaskFormSheet ref={taskFormRef} />
      <AITaskSheet ref={aiTaskRef} />
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
  },
  buttonItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default observer(TabBar)
