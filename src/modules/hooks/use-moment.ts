import moment from 'moment'
import { useMemo } from 'react'
import { useSettings } from './use-settings'
import { Language } from '~/constants'
import { getLocales } from 'react-native-localize'

export const useMoment = () => {
  const { language } = useSettings()

  const lm = useMemo(() => {
    const deviceLocale = getLocales()[0].languageTag
    const momentLocale =
      language === Language.RU
        ? 'ru'
        : deviceLocale.startsWith('en')
        ? deviceLocale
        : 'en-gb'

    function locolizedMoment(...params: Parameters<typeof moment>) {
      return moment(...params).locale(momentLocale)
    }

    locolizedMoment.default = moment

    function weekdaysMin(...params: Parameters<typeof moment.weekdays>) {
      return moment.localeData(language).weekdaysMin(...params)
    }
    locolizedMoment.weekdaysMin = weekdaysMin

    return locolizedMoment
  }, [language])

  return lm
}
