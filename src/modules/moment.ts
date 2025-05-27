import moment from 'moment'

import 'moment/locale/ru'
import 'moment/locale/en-au'
import 'moment/locale/en-ca'
import 'moment/locale/en-gb'
import 'moment/locale/en-ie'
import 'moment/locale/en-il'
import 'moment/locale/en-in'
import 'moment/locale/en-nz'
import 'moment/locale/en-sg'

moment.updateLocale('ru', {
  meridiemParse: undefined,
  isPM: undefined,
  meridiem: undefined,
})
