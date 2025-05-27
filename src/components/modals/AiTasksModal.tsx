import { Divider, Modal, Portal } from 'react-native-paper'
import { Linking, Pressable, StyleSheet, View } from 'react-native'
import { W_H_PADDING } from '~/styles'
import { BlurView } from '@react-native-community/blur'
import Surface from '~/components/ui/surface/Surface.tsx'
import { Color } from '~/styles/color.ts'
import Text from '~/components/ui/text/Text.tsx'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity.tsx'
import Icon from '~/components/ui/icons/Icon.tsx'
import { StoriesService } from '~/components/stories-service'
import { transformStoryGroupSource } from '~/modules/knowledge.ts'
import { recommendationAIStoryGroup } from '~assets/data/ai-stories.ts'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { navigationStore } from '~/navigation/navigation-store.ts'
import { useSettings } from '~/modules/hooks/use-settings.ts'
import { modalEventEmitter } from '~/components/modals/index.ts'

const AiTasksModal = () => {
  const settings = useSettings()
  const { t } = useTranslation()
  const language = settings?.language

  const [visible, setVisible] = useState(false)
  const [goal, setGoal] = useState()
  const close = () => {
    setVisible(false)
  }

  useEffect(() => {
    return modalEventEmitter.on('ai-tasks-confirm', params => {
      setVisible(true)
      setGoal(params.goal)
    })
  }, [])

  const divideWithAI = () => {
    close()
    navigationStore.aiTaskRef.current.open({ goal: goal })
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={close}
        style={{ marginTop: 0, marginBottom: 0 }}
        contentContainerStyle={{ height: '100%' }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: W_H_PADDING,
            justifyContent: 'center',
          }}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={close}>
            <BlurView
              blurType="extraDark"
              blurAmount={2}
              reducedTransparencyFallbackColor={'#000'}
              style={{ height: '100%' }}
            />
          </Pressable>

          <Surface
            style={{
              borderRadius: 8,
              backgroundColor: Color.Dark,
            }}
          >
            <View
              style={{
                paddingBottom: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text>{t('ai-recommendation.modal.title')}</Text>
              <PressableOpacity onPress={close}>
                <Icon name="close" />
              </PressableOpacity>
            </View>

            <Divider style={{ backgroundColor: Color.Grey }} />

            <View style={{ paddingVertical: 10 }}>
              <Text style={{ color: Color.LightGrey }}>
                {t('ai-recommendation.modal.subtitle-1')}
                <PressableOpacity
                  style={{
                    paddingBottom: 5,
                    top: 9,
                  }}
                  onPress={() => {
                    close()
                    setTimeout(() => {
                      StoriesService.show(
                        transformStoryGroupSource(recommendationAIStoryGroup)
                          .stories
                      )
                    }, 300)
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
                {t('ai-recommendation.modal.subtitle-2')}
                <View>
                  <Text style={{ top: 4 }}>
                    {t('ai-recommendation.modal.subtitle-3')}
                  </Text>
                </View>
                {t('ai-recommendation.modal.subtitle-4')}
                <PressableOpacity
                  onPress={() => {
                    if (language === 'ru') {
                      Linking.openURL(
                        t('ai-recommendation.modal.link-2.url.ru')
                      )
                    } else {
                      Linking.openURL(
                        t('ai-recommendation.modal.link-2.url.en')
                      )
                    }
                  }}
                  style={{ paddingBottom: 5, top: 9 }}
                >
                  <Text
                    style={{
                      color: Color.AccentBlue,
                      textDecorationColor: Color.AccentBlue,
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid',
                    }}
                  >
                    {t('ai-recommendation.modal.link-2')}
                  </Text>
                </PressableOpacity>
                {t('ai-recommendation.modal.subtitle-5')}
              </Text>
            </View>

            <Divider style={{ backgroundColor: Color.Grey }} />

            <View
              style={{
                paddingTop: 12,
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <PressableOpacity
                style={{
                  borderColor: Color.AccentBlue,
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 11,
                }}
                containerStyle={{ flex: 1 }}
                onPress={close}
              >
                <Text style={{ textAlign: 'center' }}>
                  {t('ai.button.cancel')}
                </Text>
              </PressableOpacity>
              <PressableOpacity
                style={{
                  backgroundColor: Color.AccentBlue,
                  borderRadius: 8,
                  padding: 12,
                }}
                containerStyle={{ flex: 1 }}
                onPress={divideWithAI}
              >
                <Text style={{ textAlign: 'center' }}>
                  {t('ai-recommendation.modal.divide-with-ai')}
                </Text>
              </PressableOpacity>
            </View>
          </Surface>
        </View>
      </Modal>
    </Portal>
  )
}

export default AiTasksModal
