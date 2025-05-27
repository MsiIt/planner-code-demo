import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Surface from '~/components/ui/surface/Surface'
import { Task } from '~/db/models/task'
import { Color } from '~/styles/color'
import { Checkbox, EffectSign, Section, signTextByTaskType } from './elements'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import Icon from '~/components/ui/icons/Icon'
import Divider from '~/components/ui/surface/Divider'
import { useObject, useQuery, useRealm } from '~/db'
import { GoalToRead } from '~/db/models/goal-to-read'
import { Goal } from '~/db/models/goal'
import { opacityLayoutAnimation } from '~/styles/utils'
import { StoriesService } from '~/components/stories-service'
import { transformStoryGroupSource } from '~/modules/knowledge'
import { readingStoryGroup } from '~assets/data/ai-stories'
import analytics from '@react-native-firebase/analytics'

const GoalReadingTaskItem = ({ task }: { task: Task }) => {
  const { t } = useTranslation()

  const goals = useQuery(GoalToRead)
    .filtered('taskId == $0', task._id)
    .sorted('isRead')

  const [expanded, setExpanded] = useState(false)

  const realm = useRealm()
  const onTaskCheck = () => {
    if (task.active) {
      analytics().logEvent('complete_autotask', { autotask_type: 'read_goal' })
      setExpanded(false)
    }
    realm.write(() => {
      task.active = !task.active
    })
  }

  const openStory = () => {
    StoriesService.show(transformStoryGroupSource(readingStoryGroup).stories)
  }

  if (!goals.length) {
    return null
  }

  return (
    <Surface style={{ padding: 0 }} foregroundRipple>
      <Section>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Checkbox
              label={t('task.read-and-check')}
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
      <View>
        {(expanded ? goals : goals.slice(0, 2)).map((g, i) => {
          if (!g.isValid()) {
            return null
          }
          return <GoalItem key={g.id} itemId={g.goalId} item={g} index={i} />
        })}
        {goals.length > 2 && (
          <>
            <Divider />
            <PressableOpacity
              style={{ paddingVertical: 4, alignItems: 'center' }}
              onPress={() => {
                opacityLayoutAnimation()
                setExpanded(!expanded)
              }}
            >
              <Icon name={expanded ? 'chevron-up' : 'chevron-down'} />
            </PressableOpacity>
          </>
        )}
      </View>
      {task.active && <EffectSign text={t(signTextByTaskType[task.typeId])} />}
    </Surface>
  )
}

const GoalItem = ({
  item,
  itemId,
  index,
}: {
  item: GoalToRead
  itemId: Realm.BSON.UUID
  index: number
}) => {
  const realm = useRealm()
  const goal = useObject(Goal, itemId)

  if (!goal || !item.isValid()) {
    return null
  }

  const handlePress = () => {
    realm.write(() => {
      item.isRead = !item.isRead
    })
  }

  return (
    <>
      {index > 0 && <Divider />}
      <Section>
        <Checkbox
          label={goal?.name}
          checked={item.isRead}
          onCheck={handlePress}
        />
      </Section>
    </>
  )
}

export default GoalReadingTaskItem
