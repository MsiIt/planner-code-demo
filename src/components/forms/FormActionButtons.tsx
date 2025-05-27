import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Button from '~/components/ui/buttons/Button'
import { Color } from '~/styles/color'

const FormActionButtons = ({ context }) => {
  const { t } = useTranslation()
  const { isEdit, submit, cancel } = useContext(context)

  return (
    <View style={{ flexDirection: 'row' }}>
      <Button
        title={t('cancel')}
        containerStyle={{ flex: 1 }}
        onPress={cancel}
      />
      <Button
        title={t(isEdit ? 'save' : 'add')}
        containerStyle={{ marginLeft: 16, flex: 1 }}
        style={{ backgroundColor: Color.AccentBlue }}
        onPress={submit}
      />
    </View>
  )
}

export default FormActionButtons
