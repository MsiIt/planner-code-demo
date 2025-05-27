import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import Text from '~/components/ui/text/Text'
import { View } from 'react-native'
import TextField from '../../ui/fields/TextField'
import { categoryFormContext } from './category-form-context'
import { inputLengthLimits } from '~/constants/inputs'

const CategoryForm: React.FC = () => {
  const { t } = useTranslation()
  const { isEdit, name, setName } = useContext(categoryFormContext)

  return (
    <>
      <Text style={{ textAlign: 'center' }}>
        {isEdit ? t('category-form.title.edit') : t('category-form.title.add')}
      </Text>

      <View style={{ marginTop: 16 }}>
        <TextField
          value={name}
          placeholder={t('category-form.placeholder.name')}
          maxLength={inputLengthLimits.categoryName}
          onChangeText={t => setName(t)}
        />
      </View>
    </>
  )
}

export default CategoryForm
