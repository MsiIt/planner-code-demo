import { Insets } from 'react-native'
import { Measure } from '~/@types/utils'

export const getInsets = (value?: number | Insets | null) => {
  if (!value) {
    return undefined
  }

  if (typeof value === 'number') {
    return {
      top: value,
      right: value,
      bottom: value,
      left: value,
    }
  }
  if (typeof value === 'object') {
    return value
  }
}

export const getMeasure = (ref): Promise<Measure> =>
  new Promise((res, rej) => {
    try {
      ref.measureInWindow(
        (x: number, y: number, width: number, height: number) =>
          res({ x, y, width, height })
      )
    } catch (error) {
      rej(error)
    }
  })
