import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import {
  BottomSheetModal as BSModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import BottomSheetModal from '../ui/bottom-sheet/BottomSheetModal'
import TaskFormProvider from '../forms/task/TaskFormProvider'
import KeyboardAvoidingScrollView from '../ui/views/KeyboardAvoidingScrollView'
import { LONG_SIDE, W_H_PADDING } from '~/styles'
import TaskForm from '../forms/task/TaskForm'
import LinearGradient from 'react-native-linear-gradient'
import { Color, rgba } from '~/styles/color'
import FormActionButtons from '../forms/FormActionButtons'
import { View } from 'react-native'
import { taskFromContext } from '../forms/task/task-form-context'
import { nextFrame } from '~/utils/common'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TaskFormSheet = ({}, ref) => {
  const bottomSheetModalRef = useRef<BSModal>()
  const keyboard = useReanimatedKeyboardAnimation()

  const [params, setParams] = useState()

  const snapPoints = useMemo(() => ['93%'], [])
  const open = async p => {
    setParams(p)
    await nextFrame()
    bottomSheetModalRef.current?.present()
  }

  const close = () => bottomSheetModalRef.current?.close()
  const insets = useSafeAreaInsets()
  const actionsContainerStyle = useAnimatedStyle(
    () => ({
      bottom:
        (-keyboard.height.value - insets.bottom) * keyboard.progress.value,
    }),
    [insets.bottom]
  )

  useImperativeHandle(
    ref,
    () => {
      return { open, close }
    },
    []
  )

  const onDismiss = () => {
    setParams()
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      stackBehavior="push"
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}
    >
      <TaskFormProvider params={params} onCloseRequest={close}>
        <KeyboardAvoidingScrollView
          ScrollComponent={BottomSheetScrollView}
          containerStyle={{
            paddingHorizontal: W_H_PADDING,
            paddingTop: 8,
            paddingBottom: 20,
          }}
        >
          <TaskForm />
        </KeyboardAvoidingScrollView>
        <LinearGradient
          colors={[Color.Black, rgba(Color.Black, 0)]}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 15,
            top: 0,
          }}
        />

        <Animated.View
          style={[
            actionsContainerStyle,
            {
              paddingVertical: 10,
              paddingHorizontal: W_H_PADDING,
              backgroundColor: Color.Black,
              paddingBottom: 10 + insets.bottom,
            },
          ]}
        >
          <LinearGradient
            colors={[rgba(Color.Black, 0), Color.Black]}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 30,
              top: -30,
            }}
          />
          <FormActionButtons context={taskFromContext} />
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: LONG_SIDE,
              bottom: -LONG_SIDE,
              backgroundColor: Color.Black,
            }}
          />
        </Animated.View>
      </TaskFormProvider>
    </BottomSheetModal>
  )
}

export default forwardRef(TaskFormSheet)
