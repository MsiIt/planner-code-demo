import { useState } from 'react'

export const useFormValue = <T extends unknown>(
  initialValue: T,
  validator: (v: T) => string | undefined
) => {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState(validator(initialValue))

  const validate = async (v: T) => {
    const errorMessage = validator(v)

    if (errorMessage) {
      setError(errorMessage)
      throw new Error(errorMessage)
    } else {
      setError('')
    }
  }

  const changeValueHandler = (v: T) => {
    setValue(v)
    validate(v).catch(() => 0)
  }

  return [value, changeValueHandler, error] as const
}
