import React, { useState } from 'react'
import Surface from '../surface/Surface'
import { Color } from '~/styles/color'
import Text from '../text/Text'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Time } from '~/@types'
import { useMoment } from '~/modules/hooks/use-moment'
import { Language, TIME_FORMAT } from '~/constants'
import { useSettings } from '~/modules/hooks/use-settings'
import { DateUtils } from '~/utils/date'
import { Platform } from 'react-native'
import Icon from '../icons/Icon'

const TimeField = ({
  time,
  placeholder,
  hasIcon,
  onTimeChange,
}: {
  time?: Time
  placeholder?: string
  hasIcon?: boolean
  onTimeChange: (t: Time) => void
}) => {
  const moment = useMoment()
  const [open, setOpen] = useState(false)
  const settings = useSettings()

  const [hours, minutes, seconds] = String(time ?? '12:00:00')
    .split(':')
    .map(c => Number(c))
  const instance = moment()
    .set('hours', hours)
    .set('minutes', minutes)
    .set('seconds', seconds)

  const hideDatePicker = () => {
    setOpen(false)
  }

  const handleConfirm = (selectedDate: Date) => {
    hideDatePicker()
    onTimeChange?.(moment(selectedDate).format(TIME_FORMAT))
  }

  return (
    <>
      <Surface
        style={{
          paddingVertical: 11,
          borderColor: Color.Grey,
          borderWidth: 1,
          backgroundColor: Color.Transparent,
          flexDirection: 'row',
        }}
        onPress={() => setOpen(true)}
      >
        <Text
          style={[
            { flex: 1, marginRight: 8 },
            !time && { color: Color.LightGrey },
          ]}
        >
          {time
            ? new DateUtils(moment, settings.is12hFormat).formatTime(instance)
            : placeholder}
        </Text>
        {hasIcon && <Icon name="clock" />}
      </Surface>

      {open && (
        <DateTimePickerModal
          isVisible={open}
          date={instance.toDate()}
          mode="time"
          is24Hour={!settings.is12hFormat}
          {...(Platform.OS === 'ios'
            ? !settings.is12hFormat
              ? { locale: 'en_GB' }
              : settings.language === Language.EN && settings.is12hFormat
              ? { locale: 'en_US' }
              : settings.language === Language.RU && settings.is12hFormat
              ? { locale: 'en_US' }
              : {}
            : {})}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      )}
    </>
  )
}

export default TimeField
