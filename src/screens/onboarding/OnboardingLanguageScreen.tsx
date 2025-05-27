import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ScreenComponent } from '~/@types/utils'
import { BigButton } from '~/components/screens/onboarding/elements'
import RadioButton from '~/components/ui/buttons/RadioButton'
import Surface from '~/components/ui/surface/Surface'
import Text from '~/components/ui/text/Text'
import { Language } from '~/constants'
import { ScreenName } from '~/constants/navigation'
import { W_H_PADDING } from '~/styles'
import { Color } from '~/styles/color'
import { FontFamily } from '~/styles/typography'
import { sleep } from '~/utils/common'

const OnboardingLanguageScreen: ScreenComponent = ({ navigation, route }) => {
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState(null)
  const [loading, setLoading] = useState(false)

  const next = () => {
    navigation.push(ScreenName.OnboardingStart)
  }

  const chooseLanguage = async (lng: Language) => {
    // setLoading(true)
    await sleep(100)
    setLanguage(lng)
    await sleep(50)
    i18n.changeLanguage(lng)
    // next()
    // setLoading(false)
  }

  const EnButton = useMemo(
    () => props => <LanguageButton title={'English'} {...props} />,
    []
  )
  const RuButton = useMemo(
    () => props => <LanguageButton title={'Русский'} {...props} />,
    []
  )

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{
        // paddingBottom: 108 + 20,
        minHeight: '100%',
      }}
    >
      {loading && (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size={'large'} />
        </View>
      )}
      {!loading && (
        <>
          <View
            style={{
              paddingHorizontal: W_H_PADDING,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 40,
            }}
          >
            <Text
              style={{
                color: Color.White,
                paddingVertical: 16,
                fontWeight: '400',
                fontSize: 18,
                lineHeight: 28,
                fontFamily: FontFamily.Primary,
                textAlign: 'center',
              }}
            >
              Choose your language{'\n'}
              Выберите свой язык
            </Text>

            <View style={{ width: '100%' }}>
              <RadioButton.Group
                value={language}
                onValueChange={v => chooseLanguage(v)}
              >
                <View>
                  <RadioButton.Item
                    value={Language.EN}
                    ButtonComponent={EnButton}
                  />
                  <View style={{ height: 8 }} />
                  <RadioButton.Item
                    value={Language.RU}
                    ButtonComponent={RuButton}
                  />
                </View>
              </RadioButton.Group>
            </View>
          </View>
          <BigButton
            title={t('onboarding.next-button')}
            disabled={!language}
            containerStyle={{
              marginTop: 20,
              marginBottom: 50,
              marginHorizontal: 24,
            }}
            onPress={next}
          />
        </>
      )}
    </ScrollView>
  )
}

const LanguageButton = ({ title, mark, onPress }) => {
  return (
    <Surface style={{ flexDirection: 'row', padding: 12 }} onPress={onPress}>
      <Text numberOfLines={1} style={{ flex: 1 }}>
        {title}
      </Text>
      {mark}
    </Surface>
  )
}

export default OnboardingLanguageScreen
