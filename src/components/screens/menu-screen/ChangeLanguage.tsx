import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { ModalService } from '~/components/modal-service'
import DialogModal from '~/components/modal-service/modal-components/DialogModal'
import Button from '~/components/ui/buttons/Button'
import RadioButton from '~/components/ui/buttons/RadioButton'
import Pressable from '~/components/ui/pressable/Pressable'
import Surface from '~/components/ui/surface/Surface'
import Text from '~/components/ui/text/Text'
import { Language } from '~/constants'
import { useRealm } from '~/db'
import { useSettings } from '~/modules/hooks/use-settings'
import { Color } from '~/styles/color'
import { sleep, uuidStr } from '~/utils/common'

const ChangeLanguage = () => {
  const realm = useRealm()
  const { t, i18n } = useTranslation()
  const settings = useSettings()

  const [language, setLanguage] = useState(settings.language)

  const changeLanguage = async (lng: Language) => {
    await sleep(100)
    setLanguage(lng)
    await sleep(50)
    i18n.changeLanguage(lng)
    realm.write(() => {
      settings.language = lng
    })

    const id = uuidStr()

    if (lng === 'ru') {
      ModalService.showModal(DialogModal, {
        id,
        title: t('menu.change-language.ru'),
        renderFooter: () => (
          <View style={{ flexDirection: 'row' }}>
            <Button
              title={t('ok')}
              containerStyle={{ flex: 1 }}
              style={{ backgroundColor: Color.AccentBlue }}
              onPress={() => ModalService.closeModal(id)}
            />
          </View>
        ),
      }).catch(() => 0)
    }
  }

  const EnButton = useMemo(
    () => props => <LanguageButton title={'English'} {...props} />,
    []
  )
  const RuButton = useMemo(
    () => props => <LanguageButton title={'Русский'} {...props} />,
    []
  )
  // const UkButton = useMemo(
  //   () => props => <LanguageButton title={'Українська'} {...props} />,
  //   []
  // )

  return (
    <>
      <Text style={{ color: Color.LightGrey, paddingVertical: 16 }}>
        Choose your language{'\n'}
        {/* Виберіть свою мову */}
        Выберите свой язык
      </Text>

      <RadioButton.Group
        value={language}
        onValueChange={v => changeLanguage(v)}
      >
        <View>
          <RadioButton.Item value={Language.EN} ButtonComponent={EnButton} />
          <View style={{ height: 8 }} />
          <RadioButton.Item value={Language.RU} ButtonComponent={RuButton} />
          {/* <View style={{ height: 8 }} />
          <RadioButton.Item value={Language.UK} ButtonComponent={UkButton} /> */}
        </View>
      </RadioButton.Group>
    </>
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

export default ChangeLanguage
