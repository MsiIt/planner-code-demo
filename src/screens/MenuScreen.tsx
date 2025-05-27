import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ScreenComponent } from '~/@types/utils'
import ChangeLanguage from '~/components/screens/menu-screen/ChangeLanguage'
import CreatorBanner from '~/components/screens/menu-screen/CreatorBanner'
import NotificationSettings from '~/components/screens/menu-screen/NotificationSettings'
import PushNotificationsSettings from '~/components/screens/menu-screen/PushNotificationsSettings'
import ReportForm from '~/components/screens/menu-screen/ReportForm'
import TimeSettings from '~/components/screens/menu-screen/TimeSettings'
import { StoriesService } from '~/components/stories-service'
import { SubscriptionService } from '~/components/subscription-service'
import PromotionOverlay from '~/components/subscription-service/PromotionOverlay'
import BottomSheetModal, {
  BSModal,
} from '~/components/ui/bottom-sheet/BottomSheetModal'
import Icon from '~/components/ui/icons/Icon'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import Surface from '~/components/ui/surface/Surface'
import Text from '~/components/ui/text/Text'
import KeyboardAvoidingScrollView from '~/components/ui/views/KeyboardAvoidingScrollView'
import { useSettings } from '~/modules/hooks/use-settings'
import { transformStoryGroupSource } from '~/modules/knowledge'
import { useSelector } from '~/store/utils'
import { W_H_PADDING } from '~/styles'
import { Color } from '~/styles/color'
import { subscriptionStoryGroup } from '~assets/data/ai-stories'

const MenuScreen: ScreenComponent = ({ navigation, route }) => {
  const isSubscribed = useSelector(s => s.iap.isSubscribed)
  const { t } = useTranslation()
  const settings = useSettings()

  const onSubscriptionPress = () => {
    // TODO
    // SubscriptionService.openSubscriptionSheet({ variant: 1 })
    StoriesService.show(
      transformStoryGroupSource(subscriptionStoryGroup).stories
    )
  }

  return (
    <>
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal: W_H_PADDING,
          paddingBottom: isSubscribed ? 20 : 108 + 20,
          minHeight: '100%',
        }}
      >
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <Image
            source={require('~assets/images/leon-task.png')}
            style={{ width: 86.64, height: 24.7 }}
          />
        </View>

        {!settings.creatorBannerHidden && (
          <View style={{ marginBottom: 8 }}>
            <CreatorBanner />
          </View>
        )}

        {!isSubscribed && (
          <>
            <MenuItem
              title={t('menu.subscription')}
              icon="star"
              onPress={onSubscriptionPress}
            />
            <View style={{ height: 8 }} />
          </>
        )}

        <MenuItem
          title={t('menu.notifications')}
          icon="bell-on"
          ContentComponent={NotificationSettings}
        />
        <View style={{ height: 8 }} />
        <MenuItem
          title={t('menu.pushes')}
          icon="bell-on"
          ContentComponent={PushNotificationsSettings}
        />
        <View style={{ height: 8 }} />
        <MenuItem
          title={t('menu.time')}
          icon="calendar"
          ContentComponent={TimeSettings}
        />
        <View style={{ height: 8 }} />
        <MenuItem
          title={t('menu.report')}
          icon="chat"
          ContentComponent={ReportForm}
        />
        {/* hidden lang menu 🚧 */}
        {/* <View style={{ height: 8 }} />
        <MenuItem
          title={t('menu.language')}
          sheetTitle={t('menu.language.sheet-title')}
          icon="language"
          ContentComponent={ChangeLanguage}
        /> */}

        <View
          style={{ alignItems: 'center', marginTop: 8, paddingVertical: 12 }}
        >
          <Link
            text={t('legal.privacy-policy.caption')}
            link={t('legal.privacy-policy.link')}
          />
          <View style={{ height: 8 }} />
          <Link text={t('legal.eula.caption')} link={t('legal.eula.link')} />
        </View>
      </ScrollView>

      {!isSubscribed && <PromotionOverlay />}
    </>
  )
}

const Link = ({ text, link }) => {
  return (
    <PressableOpacity
      hitSlop={8}
      onPress={() => {
        Linking.openURL(link)
      }}
    >
      <Text style={{ color: Color.LightGrey, fontSize: 12, lineHeight: 16 }}>
        {text}
      </Text>
    </PressableOpacity>
  )
}

const MenuItem = ({ title, sheetTitle, icon, ContentComponent, onPress }) => {
  const bottomSheetModalRef = useRef<BSModal>()
  const snapPoints = useMemo(() => ['93%'], [])
  const open = () => bottomSheetModalRef.current?.present()
  const close = () => bottomSheetModalRef.current?.close()

  return (
    <>
      <Surface style={{ flexDirection: 'row' }} onPress={onPress ?? open}>
        <Icon name={icon} />
        <Text style={{ marginLeft: 8 }}>{title}</Text>
      </Surface>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
      >
        <View
          style={{
            marginTop: 8,
            flexDirection: 'row',
            paddingHorizontal: W_H_PADDING,
          }}
        >
          <View style={{ width: 20 }} />
          <Text style={{ flex: 1, textAlign: 'center' }}>
            {sheetTitle ?? title}
          </Text>
          <PressableOpacity hitSlop={15} onPress={close}>
            <Icon name="close" />
          </PressableOpacity>
        </View>
        <KeyboardAvoidingScrollView
          ScrollComponent={BottomSheetScrollView}
          style={{ marginTop: 16 }}
          containerStyle={{
            paddingHorizontal: W_H_PADDING,
            paddingBottom: 20,
          }}
        >
          {ContentComponent && <ContentComponent onRequestClose={close} />}
        </KeyboardAvoidingScrollView>
      </BottomSheetModal>
    </>
  )
}

export default MenuScreen
