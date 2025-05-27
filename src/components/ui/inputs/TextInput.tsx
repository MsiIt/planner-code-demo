import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useContext,
  useRef,
} from 'react'
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native'
import { Color } from '~/styles/color'
import { keyboardAvoidingContext } from '../views/KeyboardAvoidingScrollView'
import { getMeasure } from '~/utils/react-native'

const TextInput: ForwardRefRenderFunction<
  RNTextInput,
  TextInputProps & { InputComponent: React.FC<RNTextInput> }
> = ({ InputComponent = RNTextInput, style, ...props }, ref) => {
  const inputRef = useRef<RNTextInput>()
  const focused = useRef(false)
  const { adjustScrollPosition } = useContext(keyboardAvoidingContext)

  const adjust = async () => {
    const measure = await getMeasure(inputRef.current)
    adjustScrollPosition(measure)
  }

  const focusHandler = async (
    e: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    props.onFocus?.(e)
    focused.current = true
    adjust()
  }
  const pressOutHandler = e => {
    props.onPressOut?.(e)
    if (focused.current) {
      adjust()
    }
  }

  const blurHandler = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    props.onBlur?.(e)
    focused.current = false
  }

  const lastLayoutRef = useRef()

  const layoutHandler = (e: LayoutChangeEvent) => {
    props.onLayout?.(e)

    if (
      focused.current &&
      (!lastLayoutRef.current ||
        Math.floor(lastLayoutRef.current.height) !==
          Math.floor(e.nativeEvent.layout.height))
    ) {
      adjust()
    }

    lastLayoutRef.current = e.nativeEvent.layout
  }

  return (
    <InputComponent
      ref={r => {
        inputRef.current = r
        if (ref) {
          ref.current = r
        }
      }}
      placeholderTextColor={Color.LightGrey}
      {...props}
      onFocus={focusHandler}
      onBlur={blurHandler}
      onLayout={layoutHandler}
      // onPressOut={pressOutHandler}
      onPressOut={pressOutHandler}
      verticalAlign="middle"
      style={[
        {
          color: Color.White,
          padding: 0,
          fontSize: 14,
          lineHeight: 20,
        },
        style,
      ]}
    />
  )
}

export default forwardRef(TextInput)
