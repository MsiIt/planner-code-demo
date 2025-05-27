import { Day, Time } from '~/@types'
import { MomentConstructor } from '~/@types/utils'

export const dayTimeToDate = (day: Day, time?: Time) => {
  const [hours, minutes, seconds] = (time ?? '00:00:00')
    .split(':')
    .map(c => Number(c))

  const date = new Date(day)
  date.setHours(hours)
  date.setMinutes(minutes)
  date.setSeconds(seconds)

  return date
}

export class DateUtils {
  moment: MomentConstructor
  is12hFormat: boolean

  constructor(moment: MomentConstructor, is12hFormat: boolean) {
    this.moment = moment
    this.is12hFormat = is12hFormat
  }

  formatTime(input: any) {
    const format = this.is12hFormat ? 'h:mm A' : 'HH:mm'

    if (/^\d\d:\d\d:\d\d$/.test(input)) {
      return this.moment('1970-02-01 ' + input).format(format)
    } else {
      return this.moment(input).format(format)
    }
  }
}
