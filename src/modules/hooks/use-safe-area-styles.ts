import {
  initialWindowMetrics,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

export const useSafeAreaStyles = () => {
  const insets = useSafeAreaInsets()

  return {
    paddingTop: insets.top || initialWindowMetrics?.insets.top,
    paddingBottom: insets.bottom || initialWindowMetrics?.insets.bottom,
    paddingLeft: insets.left || initialWindowMetrics?.insets.left,
    paddingRight: insets.right || initialWindowMetrics?.insets.right,
  }
}
