import React, { useState } from 'react'
import { useObject, useRealm } from '~/db'
import { uuid } from '~/utils/common'
import { Category, CategoryRepository } from '~/db/models/category'
import { categoryFormContext } from './category-form-context'
import { useTranslation } from 'react-i18next'
import { Toast } from '~/modules/toast'

const CategoryFormProvider = ({ params, children, onCloseRequest }) => {
  const { t } = useTranslation()
  const realm = useRealm()
  const category = useObject(Category, uuid(params?.categoryId))

  const [name, setName] = useState(category?.name ?? '')

  const submit = () => {
    if (!name) {
      return
    }

    try {
      realm.write(() => {
        new CategoryRepository(realm).upsert(params?.categoryId, {
          name: name.trim(),
        })
      })
      onCloseRequest?.()
    } catch (error) {
      if (error.message.includes('No space left on device')) {
        Toast.show({
          type: 'info',
          text1: t('warning.no-space-left'),
        })
      } else {
        console.error('Error writing data:', error)
      }
    }
  }
  const cancel = () => {
    onCloseRequest?.()
  }

  const contextValue = {
    isEdit: !!category,

    name,
    setName,

    submit,
    cancel,
  }

  return (
    <categoryFormContext.Provider value={contextValue}>
      {children}
    </categoryFormContext.Provider>
  )
}

export default CategoryFormProvider
