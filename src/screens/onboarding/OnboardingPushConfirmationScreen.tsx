import { AuthorizationStatus } from '@notifee/react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PermissionsAndroid } from 'react-native'
import { Platform, View } from 'react-native'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
} from '~/components/screens/onboarding/elements'
import Text from '~/components/ui/text/Text'
import { ScreenName } from '~/constants/navigation'
import messaging from '~/services/firebase/messaging'
import { NotificationService } from '~/services/notifications'
import { Color } from '~/styles/color'
import { sleep } from '~/utils/common'

const OnboardingPushConfirmationScreen = ({ route, navigation }) => {
  const { t } = useTranslation()

  const firebaseMessagingPermissions = async () => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        console.log('Authorization status:', authStatus)
      }
    } else if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      )

      const status = await NotificationService.requestPermission()

      if (status.authorizationStatus === AuthorizationStatus.DENIED) {
        await NotificationService.openNotificationSettings()
        await sleep(500)
      }
    }
  }

  const next = async () => {
    firebaseMessagingPermissions()

    navigation.push(ScreenName.OnboardingAutotaskGratitude, {
      ...route.params,
    })
  }

  return (
    <OnboardingScreen>
      <View
        style={{ marginTop: 'auto', marginBottom: 'auto', paddingVertical: 20 }}
      >
        <OnboardingFade>
          <OnboardingText>
            {t('onboarding.push-confirmation.line-1')}
            {'\n'}
            <Text
              style={{
                fontSize: 18,
                lineHeight: 28,
                textAlign: 'center',
                color: Color.AccentBlue,
              }}
            >
              {t('onboarding.next-button')}
            </Text>
            {t('onboarding.push-confirmation.line-2')}
          </OnboardingText>
        </OnboardingFade>
      </View>

      <OnboardingFade delay={400}>
        <BigButton
          title={t('onboarding.next-button')}
          containerStyle={{ marginTop: 20 }}
          onPress={next}
        />
      </OnboardingFade>
    </OnboardingScreen>
  )
}

export default OnboardingPushConfirmationScreen
