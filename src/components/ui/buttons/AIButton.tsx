import React, { useState } from 'react'
import { Color } from '~/styles/color'
import Icon from '../icons/Icon'
import Surface from '../surface/Surface'
import Text from '../text/Text'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { SubscriptionService } from '~/components/subscription-service'
import { Image } from 'react-native'
import { Modals } from '~/components/modals'

const AIButton = ({ goal }) => {
  const { t } = useTranslation()

  const isSubscribed = useSelector(s => s.iap.isSubscribed)

  const openModal = () => {
    Modals.open('ai-tasks-confirm', { goal })
  }

  const showAiHelperSubscribeModal = () => {
    SubscriptionService.openSubscriptionSheet({ variant: 6 })
  }

  return (
    <>
      <Surface
        style={{
          backgroundColor: undefined,
          borderWidth: 1,
          padding: 15,
          borderStyle: 'dashed',
          borderColor: isSubscribed ? Color.AccentBlue : Color.LightGrey,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={isSubscribed ? openModal : showAiHelperSubscribeModal}
      >
        <Icon
          name="ai-shape"
          style={{
            tintColor: isSubscribed ? Color.AccentBlue : Color.LightGrey,
          }}
        />
        <Text
          style={{
            marginLeft: 8,
            color: isSubscribed ? Color.AccentBlue : Color.LightGrey,
          }}
        >
          {t('ai-tasks.button.title')}
        </Text>
        {!isSubscribed && (
          <Image
            source={require('~assets/images/boost-lock.png')}
            style={{ marginLeft: 4, width: 46, height: 12 }}
          />
        )}
      </Surface>
    </>
  )
}

export default AIButton
