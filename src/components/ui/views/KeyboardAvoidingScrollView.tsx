import React, {
  ForwardRefRenderFunction,
  createContext,
  forwardRef,
  useRef,
  useState,
} from 'react'
import {
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'
import { Measure } from '~/@types/utils'
import { sleep } from '~/utils/common'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'

export const keyboardAvoidingContext = createContext({
  adjustScrollPosition: () => {},
})

const KeyboardAvoidingScrollView: ForwardRefRenderFunction<
  ScrollView,
  {
    ScrollComponent?: React.FC<ScrollView>
    containerStyle?: ViewStyle
  } & ScrollViewProps
> = (
  { ScrollComponent = ScrollView, containerStyle, children, ...props },
  ref
) => {
  const listRef = useRef<ScrollView>()
  const offset = useRef(0)

  const keyboard = useReanimatedKeyboardAnimation()
  const [bottomOffset, setBottomOffset] = useState(0)
  const wHeight = useWindowDimensions().height

  const contextValue = {
    async adjustScrollPosition(inputMeasure: Measure) {
      await sleep(250)

      const keyboardHeight = -keyboard.height.value

      if (keyboardHeight <= 0) {
        return
      }

      const lowerPoint = inputMeasure.height + inputMeasure.y
      const bottomLine = wHeight - keyboardHeight - StatusBar.currentHeight

      // const listMeasure = await getMeasure(listRef.current)
      // const listBottomEdge = listMeasure.height + listMeasure.y
      // setBottomOffset(wHeight - listBottomEdge - StatusBar.currentHeight)

      // console.log(lowerPoint, bottomLine)
      await sleep(50)

      if (lowerPoint > bottomLine) {
        // console.log(offset.current + lowerPoint - bottomLine + 10)

        listRef.current?.scrollTo({
          y: offset.current + lowerPoint - bottomLine + 50,
        })
      }
    },
  }

  const paddingBottomStyle =
    Number(StyleSheet.flatten(containerStyle)?.paddingBottom) || 0

  const viewStyle = useAnimatedStyle(() => {
    const paddingBottom =
      -keyboard.height.value * keyboard.progress.value +
      paddingBottomStyle -
      bottomOffset

    return { paddingBottom }
  }, [paddingBottomStyle, bottomOffset])

  return (
    <keyboardAvoidingContext.Provider value={contextValue}>
      <ScrollComponent
        ref={r => {
          listRef.current = r
          if (ref) {
            ref.current = r
          }
        }}
        {...props}
        onScroll={e => {
          props.onScroll?.(e)
          offset.current = e.nativeEvent.contentOffset.y
        }}
        scrollEventThrottle={32}
      >
        <Animated.View style={[containerStyle, viewStyle]}>
          {children}
        </Animated.View>
      </ScrollComponent>
    </keyboardAvoidingContext.Provider>
  )
}

export default forwardRef(KeyboardAvoidingScrollView)
