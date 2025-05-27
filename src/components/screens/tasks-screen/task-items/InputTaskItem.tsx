import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Surface from '~/components/ui/surface/Surface'
import { Task } from '~/db/models/task'
import { Color } from '~/styles/color'
import { Checkbox, EffectSign, Section, signTextByTaskType } from './elements'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import Icon from '~/components/ui/icons/Icon'
import TextInput from '~/components/ui/inputs/TextInput'
import Divider from '~/components/ui/surface/Divider'
import { useRealm } from '~/db'
import _ from 'lodash'
import { StoriesService } from '~/components/stories-service'
import { TaskType } from '~/constants'
import { assert } from '~/utils/assertion'
import { inputLengthLimits } from '~/constants/inputs'
import { transformStoryGroupSource } from '~/modules/knowledge'
import {
  achievementStoryGroup,
  analysisStoryGroup,
  gratitudeStoryGroup,
} from '~assets/data/ai-stories'
import analytics from '@react-native-firebase/analytics'

const InputTaskItem = ({ task, title }: { task: Task; title: string }) => {
  const { t } = useTranslation()

  const [input, setInput] = useState(task.text)

  const realm = useRealm()
  const onTaskCheck = () => {
    if (task.active) {
      const taskType =
        task.typeId === TaskType.Achievement
          ? 'achievement'
          : task.typeId === TaskType.Gratitude
          ? 'gratitude'
          : task.typeId === TaskType.DayAnalysis
          ? 'analysis'
          : 'read_goal'
      analytics().logEvent('complete_autotask', { autotask_type: taskType })
    }
    realm.write(() => {
      task.active = !task.active
    })
  }

  const commit = useMemo(() => {
    return _.debounce((text: string) => {
      realm.write(() => {
        task.text = text.trim()
      })
    }, 3000)
  }, [])

  const handleTextChange = (text: string) => {
    setInput(text)
    commit(text)
  }

  const handleBlur = () => {
    if (!input) {
      return
    }

    realm.write(() => {
      task.active = false
    })
  }

  const openStory = () => {
    const storyGroup =
      task.typeId === TaskType.Achievement
        ? achievementStoryGroup
        : task.typeId === TaskType.Gratitude
        ? gratitudeStoryGroup
        : task.typeId === TaskType.DayAnalysis
        ? analysisStoryGroup
        : undefined

    assert(storyGroup)

    StoriesService.show(transformStoryGroupSource(storyGroup).stories)
  }

  return (
    <Surface style={{ padding: 0 }} foregroundRipple>
      <Section>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Checkbox
              label={title}
              checked={!task.active}
              labelStyle={{ color: Color.White }}
              style={{ flex: 1 }}
              onCheck={onTaskCheck}
            />
          </View>

          <PressableOpacity hitSlop={10} onPress={openStory}>
            <Icon name="info" style={{ tintColor: Color.LightGrey }} />
          </PressableOpacity>
        </View>
      </Section>
      <Divider />
      {/* <Section> */}
      <View>
        <TextInput
          value={input}
          placeholder={t('press-to-fill')}
          placeholderTextColor={Color.LightGrey}
          multiline
          maxLength={inputLengthLimits.autotaskReport}
          style={{ paddingHorizontal: 12, paddingVertical: 10, maxHeight: 100 }}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
        />
      </View>
      {/* </Section> */}
      {task.active && <EffectSign text={t(signTextByTaskType[task.typeId])} />}
    </Surface>
  )
}

export default InputTaskItem
