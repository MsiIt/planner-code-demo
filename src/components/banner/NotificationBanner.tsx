import React from 'react'
import PressableOpacity from '../ui/pressable/PressableOpacity'
import { Color } from '~/styles/color'
import Icon from '../ui/icons/Icon'
import Text from '../ui/text/Text'
import { useNotifications } from './NotificationsProvider'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { uuidStr } from '~/utils/common'
import { ModalService } from '../modal-service'
import DialogModal from '../modal-service/modal-components/DialogModal'
import Button from '../ui/buttons/Button'
import { useRealm } from '~/db'
import { useSettings } from '~/modules/hooks/use-settings'
import { StoriesService } from '../stories-service'
import { transformStoryGroupSource } from '~/modules/knowledge'
import { breakGoalsDownStoryGroup } from '~assets/data/ai-stories'

const NotificationBanner = ({ id }) => {
  const { t } = useTranslation()
  const realm = useRealm()
  const settings = useSettings()

  const { notifications, handleClose } = useNotifications()
  const notification = notifications.find(not => not.id === id)

  // if (notification?.hidden) {
  //   return null
  // }

  const hide = () => {
    const uuid = uuidStr()
    ModalService.showModal(DialogModal, {
      id: uuid,
      title: t('menu.creator-banner.hide.message'),
      renderFooter: () => (
        <View style={{ flexDirection: 'row' }}>
          <Button
            title={t('cancel')}
            containerStyle={{ flex: 1 }}
            onPress={() => ModalService.closeModal(uuid)}
          />
          <Button
            title={t('yes')}
            containerStyle={{ flex: 1, marginLeft: 8 }}
            style={{
              backgroundColor: Color.AccentRed,
              borderColor: Color.AccentRed,
            }}
            onPress={() => {
              ModalService.closeModal(uuid)
              if (id === 1) {
                realm.write(() => {
                  settings.categoryBannerHidden = true
                })
              } else if (id === 2) {
                realm.write(() => {
                  settings.goalBannerHidden = true
                })
              }
            }}
          />
        </View>
      ),
    }).catch(() => 0)
  }

  return (
    <View
      style={{
        marginVertical: 8,
        backgroundColor: Color.Dark,
        borderRadius: 8,
        padding: 8,
        paddingLeft: 12,
        flexDirection: 'row',
        gap: 8,
      }}
    >
      <Icon name="info" style={{ tintColor: Color.LightGrey }} />
      <Text style={{ color: Color.LightGrey, width: '83%' }}>
        {notification?.title}{' '}
        <PressableOpacity
          onPress={() => {
            StoriesService.show(
              transformStoryGroupSource(breakGoalsDownStoryGroup).stories
            )
          }}
          style={{ top: 3.5, left: 2 }}
        >
          <Text
            style={{
              color: Color.AccentBlue,
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationColor: Color.AccentBlue,
            }}
          >
            {t('notification-banner.advice')}
          </Text>
        </PressableOpacity>
      </Text>
      <PressableOpacity onPress={hide}>
        <Icon name="close" />
      </PressableOpacity>
    </View>
  )
}

export default NotificationBanner
