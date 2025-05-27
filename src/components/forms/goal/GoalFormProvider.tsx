import React, { useState } from 'react'
import { useObject, useQuery, useRealm } from '~/db'
import { uuid, uuidStr } from '~/utils/common'
import { Goal, GoalRepository } from '~/db/models/goal'
import { goalFormContext } from './goal-form-context'
import { Category } from '~/db/models/category'
import { useFormValue } from '~/utils/hooks/use-form-value'
import { useTranslation } from 'react-i18next'
import { NotificationService } from '~/services/notifications'
import { useMoment } from '~/modules/hooks/use-moment'
import { ModalService } from '~/components/modal-service'
import DialogModal from '~/components/modal-service/modal-components/DialogModal.tsx'
import { View } from 'react-native'
import Button from '~/components/ui/buttons/Button.tsx'
import { Color } from '~/styles/color.ts'
import Text, { RNText } from '~/components/ui/text/Text.tsx'
import { SubscriptionService } from '~/components/subscription-service'
import { useSelector } from 'react-redux'
import AiTasksModal from '~/components/modals/AiTasksModal.tsx'
import { Modals } from '~/components/modals'
import { Toast } from '~/modules/toast'
import analytics from '@react-native-firebase/analytics'

const GoalFormProvider = ({ params, children, onCloseRequest }) => {
  const realm = useRealm()
  const { t } = useTranslation()
  const moment = useMoment()
  const categories = useQuery(Category)
  const goalId = params?.goalId
  const goal = useObject(Goal, uuid(goalId))
  const isSubscribed = useSelector(s => s.iap.isSubscribed)

  const [name, setName, nameError] = useFormValue(goal?.name ?? '', v => {
    if (!v.length) {
      return t('required-field')
    }
  })
  const [category, setCategory] = useState(
    params?.category ?? goal?.category?.[0] ?? categories[0]
  )
  const [deadline, setDeadline, deadlineError] = useFormValue(
    goal?.deadline,
    v => {
      if (!v) {
        return t('required-field')
      }
    }
  )
  const [active, setActive] = useState(goal?.active ?? true)

  const [showErrors, setShowErrors] = useState(false)

  const submit = async () => {
    let goal: Goal

    if (nameError || deadlineError) {
      setShowErrors(true)
      return
    }

    try {
      realm.write(() => {
        goal = new GoalRepository(realm).upsert(goalId, {
          name: name.trim(),
          category,
          deadline,
          active,
        })
      })

      if (!goalId) {
        const randomNumber = Math.floor(Math.random() * 3) + 1
        await NotificationService.schedule({
          title: t(`notifications.new-goal.title.${randomNumber}`),
          text: t(`notifications.new-goal.text.${randomNumber}`),
          timestamp: moment().toDate().getTime() + 2000,
        })
        const goalType =
          category.name === t('goal.type.finance')
            ? 'finance'
            : category.name === t('goal.type.health')
            ? 'health'
            : category.name === t('goal.type.relationship')
            ? 'relationship'
            : category.name === t('goal.type.travels')
            ? 'travels'
            : category.name === t('goal.type.career')
            ? 'career'
            : 'other'

        analytics().logEvent('create_goal', { goal_type: goalType })

        setTimeout(() => {
          const id = uuidStr()

          const openAiModal = () => {
            if (isSubscribed) {
              Modals.open('ai-tasks-confirm', { goal })
            } else {
              SubscriptionService.openSubscriptionSheet({ variant: 6 })
            }

            ModalService.closeModal(id)
          }

          ModalService.showModal(DialogModal, {
            id,
            title: t('ai-intro-modal.title'),
            renderBody: () => (
              <Text style={{ color: Color.LightGrey }}>
                <RNText>{t('ai-intro-modal.text')}</RNText>
              </Text>
            ),
            renderFooter: () => (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button
                  title={t('ai-intro-modal.no')}
                  containerStyle={{ flex: 1 }}
                  style={{
                    backgroundColor: Color.AccentRed,
                    borderColor: Color.AccentRed,
                  }}
                  onPress={() => ModalService.closeModal(id)}
                />
                <Button
                  title={t('ai-intro-modal.yes')}
                  containerStyle={{ flex: 1 }}
                  style={{ backgroundColor: Color.AccentBlue }}
                  onPress={openAiModal}
                />
              </View>
            ),
          }).catch(() => 0)
        }, 3000)
      }

      onCloseRequest?.()
    } catch (error) {
      if (error.message.includes('No space left on device')) {
        Toast.show({
          type: 'info',
          text1: t('warning.no-space-left'),
        })
      } else {
        console.error('Error writing data:', error)
      }
    }
  }
  const cancel = () => {
    onCloseRequest?.()
  }

  const contextValue = {
    isEdit: !!goal,

    name,
    nameError,
    setName,
    category,
    setCategory,
    deadline,
    deadlineError,
    setDeadline,

    showErrors,

    submit,
    cancel,
  }

  return (
    <goalFormContext.Provider value={contextValue}>
      {children}
    </goalFormContext.Provider>
  )
}

export default GoalFormProvider
