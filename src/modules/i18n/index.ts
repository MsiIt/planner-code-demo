import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import 'intl-pluralrules'
import { ru } from './ru'
import { en } from './en'
import { uk } from './uk'
import { Language } from '~/constants'
import { getLocales } from 'react-native-localize'

export const resources = { ru }
const defaultLanguage = Language.RU
export const defaultNs = 'translation'

export const userLanguage = getLocales()[0]
  .languageTag.slice(0, 2)
  .toLowerCase()
export const initialLanguage = Object.keys(resources).includes(userLanguage)
  ? userLanguage
  : defaultLanguage

i18n.use(initReactI18next).init({
  lng: initialLanguage,
  debug: __DEV__,
  resources,
})

export default i18n
