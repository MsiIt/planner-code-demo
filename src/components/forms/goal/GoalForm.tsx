import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import Text from '~/components/ui/text/Text'
import { View } from 'react-native'
import TextField from '../../ui/fields/TextField'
import { goalFormContext } from './goal-form-context'
import CategorySelector from '~/components/selectors/CategorySelector'
import DateField from '~/components/ui/fields/DateField'
import { inputLengthLimits } from '~/constants/inputs'

const GoalForm: React.FC = () => {
  const { t } = useTranslation()
  const {
    isEdit,
    name,
    nameError,
    setName,
    category,
    setCategory,
    deadline,
    deadlineError,
    setDeadline,
    showErrors,
  } = useContext(goalFormContext)

  return (
    <>
      <Text style={{ textAlign: 'center' }}>
        {isEdit ? t('goal-form.title.edit') : t('goal-form.title.add')}
      </Text>

      <View style={{ marginTop: 16 }}>
        <TextField
          value={name}
          placeholder={t('goal-form.placeholder.name')}
          maxLength={inputLengthLimits.goalName}
          error={showErrors && nameError}
          onChangeText={t => setName(t)}
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <CategorySelector category={category} onSelect={c => setCategory(c)} />
      </View>

      <View style={{ marginTop: 16 }}>
        <DateField
          date={deadline}
          placeholder={t('goal-form.placeholder.date')}
          error={showErrors && deadlineError}
          onDateChange={d => setDeadline(d)}
        />
      </View>
    </>
  )
}

export default GoalForm
