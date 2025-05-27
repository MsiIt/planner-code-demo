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
import KeyboardAvoidingScrollView from '../ui/views/KeyboardAvoidingScrollView'
import { LONG_SIDE, W_H_PADDING } from '~/styles'
import LinearGradient from 'react-native-linear-gradient'
import { Color, rgba } from '~/styles/color'
import { Image, Platform, View } from 'react-native'
import { nextFrame } from '~/utils/common'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from '../ui/text/Text'
import PressableOpacity from '../ui/pressable/PressableOpacity'
import Icon, { IconSource } from '../ui/icons/Icon'
import { useTranslation } from 'react-i18next'
import { useMoment } from '~/modules/hooks/use-moment'
import { ActivityIndicator, Menu } from 'react-native-paper'
import Button from '../ui/buttons/Button'
import Divider from '../ui/surface/Divider'
import TextInput from '../ui/inputs/TextInput'
import { inputLengthLimits } from '~/constants/inputs'
import { AIApi } from '~/api/ai-api'
import { getUniqueId } from 'react-native-device-info'
import installations from '~/services/firebase/installations'
import { useRealm } from '~/db'
import { TaskRepository } from '~/db/models/task'
import { Priority, TaskType } from '~/constants'

const AITaskSheet = ({}, ref) => {
  const bottomSheetModalRef = useRef<BSModal>()
  const keyboard = useReanimatedKeyboardAnimation()

  const { t } = useTranslation()
  const moment = useMoment()

  const realm = useRealm()

  const [params, setParams] = useState()
  const [aiTasks, setAiTasks] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getTasks = async goal => {
      setIsLoading(true)

      // const reqData = {
      //   externalId: await Platform.select({
      //     ios: () => getUniqueId(),
      //     default: () => installations().getId(),
      //   })(),
      //   goal,
      // }
      const reqData = {
        externalId: await installations().getId(),
        goal,
      }

      const result = await AIApi.getAITasks(reqData)

      if (result.status !== 200) {
        setAiTasks([])
      } else {
        setAiTasks(result?.data)
      }

      setIsLoading(false)
    }

    if (params) {
      getTasks(params.goal?.name)
    }
  }, [params])

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

  const onClose = () => {
    close()
    onDismiss()
  }

  const createAITasks = () => {
    setIsLoading(true)
    aiTasks.forEach(task => {
      realm.write(() => {
        new TaskRepository(realm).upsert(undefined, {
          goal: params.goal,
          active: true,
          name: task?.title,
          typeId: TaskType.Custom,
          priorityId: Priority.NotSpecified,
        })
      })
    })

    setTimeout(() => {
      setIsLoading(false)
      onClose()
    }, 3000)
  }

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      stackBehavior="push"
      index={0}
      snapPoints={snapPoints}
      onDismiss={onDismiss}
    >
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 16,
          paddingTop: 8,
          paddingHorizontal: W_H_PADDING,
          alignItems: 'center',
        }}
      >
        <PressableOpacity hitSlop={20} onPress={onClose}>
          <Icon name="chevron-left" />
        </PressableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center' }}>{params?.goal?.name}</Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              lineHeight: 16,
              color: Color.LightGrey,
            }}
          >
            {t('until')} {moment(params?.goal?.deadline).format('LL')}
          </Text>
        </View>
        <Icon name="chevron-left" style={{ tintColor: 'transparent' }} />
      </View>

      {(isLoading || aiTasks.length === 0) && (
        <BottomSheetScrollView
          style={{
            paddingHorizontal: W_H_PADDING,
            paddingTop: 8,
            paddingBottom: 20,
          }}
          contentContainerStyle={
            isLoading || aiTasks.length === 0
              ? {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              : {}
          }
        >
          {isLoading && (
            <View
              style={{
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator />
            </View>
          )}
          {!isLoading && aiTasks.length === 0 && (
            <View style={{ alignItems: 'center', gap: 40 }}>
              <Image
                source={require('~assets/images/ai-failed.png')}
                style={{ width: 200, height: 118, resizeMode: 'contain' }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  paddingHorizontal: 20,
                  color: Color.LightGrey,
                }}
              >
                {t('ai-sheet.empty-list.description-1')}
                <PressableOpacity
                  style={{
                    paddingBottom: 5,
                    top: 9,
                  }}
                >
                  <Text
                    style={{
                      color: Color.AccentBlue,
                      textDecorationColor: Color.AccentBlue,
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid',
                    }}
                  >
                    {t('ai-recommendation.modal.link-1')}
                  </Text>
                </PressableOpacity>
                {t('ai-sheet.empty-list.description-2')}
              </Text>
            </View>
          )}
        </BottomSheetScrollView>
      )}

      {!isLoading && aiTasks.length !== 0 && (
        <KeyboardAvoidingScrollView
          ScrollComponent={BottomSheetScrollView}
          style={{
            paddingHorizontal: W_H_PADDING,
            paddingTop: 8,
            paddingBottom: 20,
          }}
          containerStyle={
            isLoading || aiTasks.length === 0
              ? {
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'green',
                }
              : {}
          }
        >
          <Text style={{ paddingVertical: 16, color: Color.LightGrey }}>
            {t('ai-sheet.successful-division')}
          </Text>
          <View
            style={{
              borderRadius: 8,
              backgroundColor: Color.Dark,
              marginBottom: 24,
            }}
          >
            {aiTasks.map((task, index) => {
              return (
                <AITaskItem
                  key={task?.sort}
                  task={task}
                  index={index}
                  tasks={aiTasks}
                  onChange={setAiTasks}
                />
              )
            })}
          </View>
        </KeyboardAvoidingScrollView>
      )}

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
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {!isLoading && aiTasks.length === 0 && (
            <Button
              title={t('ai-sheet.empty-list.ok.button')}
              containerStyle={{ flex: 1 }}
              style={{
                borderWidth: 0,
                backgroundColor: Color.AccentBlue,
                borderRadius: 8,
              }}
              onPress={onClose}
            />
          )}
          {!isLoading && aiTasks.length !== 0 && (
            <>
              <Button
                title={t('ai.button.cancel')}
                containerStyle={{ flex: 1 }}
                style={{
                  padding: 10,
                  borderRadius: 8,
                }}
                onPress={onClose}
              />
              <Button
                title={t('ai.button.confirm')}
                containerStyle={{ flex: 1 }}
                onPress={createAITasks}
                style={{
                  borderWidth: 0,
                  backgroundColor: Color.AccentBlue,
                  borderRadius: 8,
                }}
              />
            </>
          )}
        </View>
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
    </BottomSheetModal>
  )
}

const TrashMenuIcon = ({ size }) => (
  <Icon name="trash" size={size} style={{ tintColor: Color.AccentRed }} />
)
const AITaskItem = ({ task, index, tasks, onChange }) => {
  const { t } = useTranslation()

  const [editing, setEditing] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [inputText, setInputText] = useState(task.title)
  const [initialTitle, setInitialTitle] = useState(task.title)

  const closeMenu = () => setOpenMenu(false)

  const deleteTaskHandler = id => {
    closeMenu()
    onChange(tasks.filter(t => t.sort !== id))
  }

  const editHandler = () => {
    closeMenu()
    setEditing(true)
    setInitialTitle(task.title)
  }

  const onSave = () => {
    const name = inputText.trim()
    if (name && name !== task.name) {
      onChange(
        tasks.map(t => (t.sort === task.sort ? { ...t, title: name } : t))
      )
    } else {
      onCancel()
    }

    setEditing(false)
  }

  const onCancel = () => {
    setInputText(initialTitle)
    setEditing(false)
  }

  return (
    <>
      {editing && (
        <TaskAdding
          value={inputText}
          setValue={t => setInputText(t)}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      {!editing && (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              color: Color.LightGrey,
              flex: 1,
              paddingRight: 20,
            }}
          >
            {task.title}
          </Text>
          <Menu
            visible={openMenu}
            onDismiss={closeMenu}
            anchor={
              <PressableOpacity onPress={() => setOpenMenu(!openMenu)}>
                <Icon
                  name={'triple-dot'}
                  style={[
                    { tintColor: Color.LightGrey },
                    openMenu && { tintColor: Color.AccentBlue },
                  ]}
                />
              </PressableOpacity>
            }
            anchorPosition="bottom"
          >
            <Menu.Item
              title={t('action.edit')}
              leadingIcon={{ source: IconSource.edit, direction: 'ltr' }}
              onPress={editHandler}
            />
            <Menu.Item
              title={t('action.delete')}
              titleStyle={{ color: Color.AccentRed }}
              leadingIcon={TrashMenuIcon}
              onPress={() => deleteTaskHandler(task.sort)}
            />
          </Menu>
        </View>
      )}

      {index !== tasks.length - 1 && <Divider />}
    </>
  )
}

const TaskAdding = ({ value, setValue, onSave, onCancel }) => {
  const inputRef = useRef()

  useEffect(() => {
    inputRef.current?.focus?.()
  }, [])

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingLeft: 12,
      }}
    >
      <TextInput
        ref={inputRef}
        value={value}
        // onBlur={onSave}
        multiline
        onChangeText={t => setValue(t)}
        maxLength={inputLengthLimits.taskName}
        style={[
          { flex: 1, maxHeight: 80, paddingLeft: 8 },
          Platform.select({
            ios: { padding: 0, paddingBottom: 12, paddingTop: 8 },
            default: { paddingVertical: 6.2 },
          }),
        ]}
      />

      <ActionButton
        icon={<Icon name="close" style={{ tintColor: Color.AccentRed }} />}
        onPress={onCancel}
      />
      <ActionButton
        icon={<Icon name="check" style={{ tintColor: Color.AccentBlue }} />}
        style={{ paddingRight: 16 }}
        // onPress={() => inputRef.current?.blur()}
        onPress={onSave}
      />
    </View>
  )
}

const ActionButton = ({ icon, style, onPress }) => {
  return (
    <PressableOpacity
      containerStyle={[
        {
          marginLeft: 8,
          alignSelf: 'flex-end',
          marginBottom: 10,
        },
        style,
      ]}
      onPress={onPress}
    >
      {icon}
    </PressableOpacity>
  )
}

export default forwardRef(AITaskSheet)
