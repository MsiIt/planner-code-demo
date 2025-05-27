import { defaultNs } from '~/modules/i18n'
import { ru } from '~/modules/i18n/ru'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNs
    resources: typeof ru
  }
}
