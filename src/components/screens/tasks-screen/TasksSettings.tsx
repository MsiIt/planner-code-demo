import React, { memo, useMemo, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { BottomSheetModal as BSModal } from '@gorhom/bottom-sheet'
import BottomSheetModal from '~/components/ui/bottom-sheet/BottomSheetModal'
import Icon from '~/components/ui/icons/Icon'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import Text, { RNText } from '~/components/ui/text/Text'
import { useTranslation } from 'react-i18next'
import { W_H_PADDING } from '~/styles'
import { Color } from '~/styles/color'
import Surface from '~/components/ui/surface/Surface'
import SwitchButton from '~/components/ui/buttons/SwitchButton'
import { useSettings } from '~/modules/hooks/use-settings'
import { useRealm } from '~/db'
import { ModalService } from '~/components/modal-service'
import DialogModal from '~/components/modal-service/modal-components/DialogModal'
import { uuidStr } from '~/utils/common'
import Button from '~/components/ui/buttons/Button'
import { StoriesService } from '~/components/stories-service'
import { transformStoryGroupSource } from '~/modules/knowledge'
import {
  achievementStoryGroup,
  analysisStoryGroup,
  gratitudeStoryGroup,
  readingStoryGroup,
} from '~assets/data/ai-stories'
import { useMoment } from '~/modules/hooks/use-moment'
import { DATE_FORMAT } from '~/constants'

const TasksSettings = () => {
  const bottomSheetModalRef = useRef<BSModal>()
  const snapPoints = useMemo(() => ['93%'], [])

  const open = () => bottomSheetModalRef.current?.present()
  const close = () => bottomSheetModalRef.current?.close()

  return (
    <>
      <PressableOpacity hitSlop={15} onPress={open}>
        <Icon name="side-menu" />
      </PressableOpacity>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
      >
        <TasksSettingsView />
      </BottomSheetModal>
    </>
  )
}

const TasksSettingsView = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text style={{ textAlign: 'center', marginTop: 8, marginBottom: 16 }}>
        {t('tasks-settings.title')}
      </Text>

      <Text style={styles.subTitle}>{t('tasks-settings.general')}</Text>

      <Item
        settingKey="transferUnfinishedTasksEnabledAt"
        title={t('tasks-settings.move-on-the-next-day')}
        icon={<Icon name="autotask-delay" />}
      />
      <Item
        settingKey="sortTasksByPriority"
        title={t('tasks-settings.sort-by-priority')}
        icon={<Icon name="warning" />}
        containerStyle={{ marginTop: 8 }}
      />

      <Text style={[{ marginTop: 16 }, styles.subTitle]}>
        {t('tasks-settings.management')}
      </Text>

      <Item
        settingKey="readAndCheckAutotaskEnabledSince"
        title={t('task.read-and-check')}
        stories={transformStoryGroupSource(readingStoryGroup).stories}
        isAutotask
      />
      <Item
        settingKey="gratitudeAutotaskEnabledSince"
        title={t('task.gratitude')}
        isAutotask
        stories={transformStoryGroupSource(gratitudeStoryGroup).stories}
        containerStyle={{ marginTop: 8 }}
      />
      <Item
        settingKey="dayAnalysisAutotaskEnabledSince"
        title={t('task.day-analysis')}
        isAutotask
        stories={transformStoryGroupSource(analysisStoryGroup).stories}
        containerStyle={{ marginTop: 8 }}
      />
      <Item
        settingKey="achivementAutotaskEnabledSince"
        title={t('task.achivement-of-the-day')}
        isAutotask
        stories={transformStoryGroupSource(achievementStoryGroup).stories}
        containerStyle={{ marginTop: 8 }}
      />
    </>
  )
}

const Item = ({
  settingKey,
  title,
  icon,
  isAutotask,
  stories,
  containerStyle,
}: {
  settingKey: string
  title: string
  icon?: React.JSX.Element
  isAutotask?: boolean
  stories?: any
  containerStyle?: StyleProp<ViewStyle>
}) => {
  const realm = useRealm()
  const { t } = useTranslation()
  const settings = useSettings()
  const value = settings[settingKey]
  const switchRef = useRef()
  const moment = useMoment()

  const ask = (renderBody: () => React.JSX.Element) => {
    const id = uuidStr()
    ModalService.showModal(DialogModal, {
      id,
      title: t('warning'),
      renderBody,
      renderFooter: () => (
        <View style={{ flexDirection: 'row' }}>
          <Button
            title={t('cancel')}
            containerStyle={{ flex: 1 }}
            onPress={() => ModalService.closeModal(id)}
          />
          <Button
            title={t('ok')}
            containerStyle={{
              flex: 1,
              marginLeft: 8,
            }}
            style={{ backgroundColor: Color.AccentBlue }}
            onPress={() => {
              ModalService.closeModal(id)
              switchRef.current.handlePress()
            }}
          />
        </View>
      ),
    }).catch(() => 0)
  }

  const onChange = v => {
    setTimeout(
      () =>
        realm.write(() => {
          if (isAutotask) {
            settings[settingKey] = v
              ? moment().add(1, 'day').format(DATE_FORMAT)
              : null
          } else if (settingKey === 'transferUnfinishedTasksEnabledAt') {
            settings[settingKey] = v ? moment().format(DATE_FORMAT) : null
          } else {
            settings[settingKey] = v
          }
        }),
      300
    )
  }

  const handlePress = () => {
    if (isAutotask) {
      ask(() => (
        <Text style={{ color: Color.LightGrey }}>
          {value ? (
            <>
              <RNText>
                {t('tasks-settings.autotask-modal.disabling.begin')}{' '}
              </RNText>
              <RNText style={{ color: Color.White }}>{title} </RNText>
              <RNText>
                {t('tasks-settings.autotask-modal.disabling.end')}
              </RNText>
            </>
          ) : (
            <>
              <RNText>
                {t('tasks-settings.autotask-modal.enabling.begin')}{' '}
              </RNText>
              <RNText style={{ color: Color.White }}>{title} </RNText>
              <RNText>{t('tasks-settings.autotask-modal.enabling.end')}</RNText>
            </>
          )}
        </Text>
      ))
    } else if (settingKey === 'transferUnfinishedTasksEnabledAt') {
      ask(() => (
        <Text style={{ color: Color.LightGrey }}>
          {value ? (
            <>
              <RNText>
                {t('tasks-settings.moving-unfinished-tasks.disabling.1')}{' '}
              </RNText>
              <RNText style={{ color: Color.White }}>
                {t('tasks-settings.moving-unfinished-tasks.disabling.2')}{' '}
              </RNText>
              <RNText>
                {t('tasks-settings.moving-unfinished-tasks.disabling.3')}
              </RNText>
            </>
          ) : (
            <>
              <RNText>
                {t('tasks-settings.moving-unfinished-tasks.enabling.1')}{' '}
              </RNText>
              <RNText style={{ color: Color.White }}>
                {t('tasks-settings.moving-unfinished-tasks.enabling.2')}{' '}
              </RNText>
              <RNText>
                {t('tasks-settings.moving-unfinished-tasks.enabling.3')}
              </RNText>
            </>
          )}
        </Text>
      ))
    } else {
      switchRef.current.handlePress()
    }
  }

  const onInfoPress = () => {
    StoriesService.show(stories)
  }

  return (
    <Surface
      containerStyle={[{ marginHorizontal: W_H_PADDING }, containerStyle]}
      style={{ padding: 12 }}
      foregroundRipple
      onPress={handlePress}
    >
      <View style={{ flexDirection: 'row' }}>
        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
        <Text style={{ flex: 1 }}>
          {title}
          {stories && (
            <>
              {'  '}
              <PressableOpacity
                hitSlop={10}
                containerStyle={{ transform: [{ translateY: 5 }] }}
                onPress={onInfoPress}
              >
                <Icon name="info" style={{ tintColor: Color.LightGrey }} />
              </PressableOpacity>
            </>
          )}
        </Text>
        <View style={{ marginLeft: 8, alignSelf: 'center' }}>
          <SwitchButton
            ref={switchRef}
            value={value}
            disabled
            onChange={onChange}
          />
        </View>
      </View>
    </Surface>
  )
}

const styles = StyleSheet.create({
  subTitle: {
    paddingVertical: 16,
    paddingHorizontal: W_H_PADDING,
    color: Color.LightGrey,
  },
})

export default memo(TasksSettings)
