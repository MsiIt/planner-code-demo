import Joi from 'joi'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { UserApi } from '~/api/user-api'
import { ModalService } from '~/components/modal-service'
import DialogModal from '~/components/modal-service/modal-components/DialogModal'
import Button from '~/components/ui/buttons/Button'
import TextField from '~/components/ui/fields/TextField'
import Text from '~/components/ui/text/Text'
import { inputLengthLimits } from '~/constants/inputs'
import { Color } from '~/styles/color'
import { useFormValue } from '~/utils/hooks/use-form-value'

const tlds = require('@sideway/address/lib/tlds')

const ReportForm = ({ onRequestClose }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [email, setEmail, emailError] = useFormValue('', v => {
    if (!v) {
      return t('required-field')
    }

    try {
      Joi.assert(v, Joi.string().email({ tlds: { allow: tlds } }))
    } catch (error) {
      console.log(error)
      return t('menu.report.incorrect-email')
    }
  })
  const [subject, setSubject, subjectError] = useFormValue('', s => {
    if (!s.length) {
      return t('required-field')
    }
  })
  const [message, setMessage, messageError] = useFormValue('', m => {
    if (!m.length) {
      return t('required-field')
    }
  })

  const submit = async () => {
    if (loading) {
      return
    }

    if (emailError || subjectError || messageError) {
      setShowErrors(true)
      return
    }

    try {
      setLoading(true)

      await UserApi.appeal({
        email,
        title: subject,
        message,
      })
      onRequestClose?.()
      // 🚧 appeal succes message
      // ModalService.showModal(DialogModal, {
      //   title: t('menu.report.success'),
      //   renderBody: () => <Text>{t('menu.report.success.message')}</Text>,
      // }).catch(() => 0)
    } catch (error) {
      console.warn(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Text style={{ color: Color.LightGrey, paddingVertical: 16 }}>
        {t('menu.report.body')}
      </Text>

      <TextField
        value={email}
        placeholder={t('menu.report.email.placeholder')}
        keyboardType="email-address"
        error={showErrors && emailError}
        maxLength={inputLengthLimits.reportEmail}
        onChangeText={t => setEmail(t)}
      />
      <View style={{ height: 16 }} />
      <TextField
        value={subject}
        placeholder={t('menu.report.subject.placeholder')}
        error={showErrors && subjectError}
        maxLength={inputLengthLimits.reportSubject}
        onChangeText={t => setSubject(t)}
      />
      <View style={{ height: 16 }} />
      <TextField
        value={message}
        placeholder={t('menu.report.message.placeholder')}
        multiline
        error={showErrors && messageError}
        textAlignVertical="top"
        maxLength={inputLengthLimits.reportMessage}
        style={{ height: 112 }}
        onChangeText={t => setMessage(t)}
      />
      <View style={{ height: 16 }} />
      <Button
        title={t('menu.report.send')}
        disabled={loading}
        style={{ backgroundColor: Color.AccentBlue }}
        onPress={submit}
      />
    </>
  )
}

export default ReportForm
