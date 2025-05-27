import React, { useState } from 'react'
import Surface from '../surface/Surface'
import { Color } from '~/styles/color'
import Icon from '../icons/Icon'
import Text from '../text/Text'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Day } from '~/@types'
import { useMoment } from '~/modules/hooks/use-moment'
import { DATE_FORMAT, Language } from '~/constants'
import { useSettings } from '~/modules/hooks/use-settings'
import { Platform, View } from 'react-native'
import { userLanguage } from '~/modules/i18n'
import PressableOpacity from '../pressable/PressableOpacity'
import { useTranslation } from 'react-i18next'

const DateField = ({
  date,
  placeholder,
  error = false,
  dateFormat,
  additionalOptions,
  stopRepeatMode,
  onDateChange,
}: {
  date?: Day
  placeholder: string
  error?: boolean
  dateFormat?: string
  additionalOptions?: object
  stopRepeatMode?: true
  onDateChange: (d: Day) => void
}) => {
  const moment = useMoment()
  const { t } = useTranslation()
  const settings = useSettings()
  const [open, setOpen] = useState(false)

  const hideDatePicker = () => {
    setOpen(false)
  }

  const handleConfirm = (selectedDate: Date) => {
    hideDatePicker()
    onDateChange?.(moment(selectedDate).format(DATE_FORMAT))
  }

  if (stopRepeatMode) {
    return (
      <>
        <PressableOpacity
          style={{
            marginTop: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          containerStyle={{ paddingVertical: 12 }}
          onPress={() => setOpen(true)}
        >
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <View
              style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
            >
              <Icon name="refresh-stop" size={20} />
              <Text>{t('stop-repeat.title')}</Text>
            </View>
          </View>
          <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 8 }}>
            <Text>
              {date
                ? moment(date).format('DD MMMM YYYY')
                : t('stop-repeat.never')}
            </Text>
          </View>
        </PressableOpacity>

        {open && (
          <DateTimePickerModal
            isVisible={open}
            date={date ? new Date(date) : new Date()}
            {...(Platform.OS === 'ios'
              ? settings.language === Language.EN
                ? { locale: userLanguage }
                : settings.language === Language.RU
                ? { locale: settings.language }
                : {}
              : {})}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            {...additionalOptions}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Surface
        style={[
          {
            paddingVertical: 11,
            borderColor: Color.Grey,
            borderWidth: 1,
            backgroundColor: Color.Transparent,
            flexDirection: 'row',
          },
          error && { borderColor: Color.AccentRed },
        ]}
        onPress={() => setOpen(true)}
      >
        <Text
          style={[
            { flex: 1, marginRight: 8 },
            !date && { color: Color.LightGrey },
          ]}
        >
          {date ? moment(date).format(dateFormat ?? 'LL') : placeholder}
        </Text>
        <Icon name="calendar" />
      </Surface>

      {open && (
        <DateTimePickerModal
          isVisible={open}
          date={date ? new Date(date) : new Date()}
          {...(Platform.OS === 'ios'
            ? settings.language === Language.EN
              ? { locale: userLanguage }
              : settings.language === Language.RU
              ? { locale: settings.language }
              : {}
            : {})}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          {...additionalOptions}
        />
      )}
    </>
  )
}

export default DateField
