import { LayoutAnimation } from 'react-native'

export const opacityLayoutAnimation = ({
  duration = 100,
  onFinish = () => {},
} = {}) =>
  LayoutAnimation.configureNext(
    {
      duration,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeOut },
    },
    onFinish
  )
