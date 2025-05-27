import React from 'react'
import { Image, ImageProps } from 'react-native'
import { Color } from '~/styles/color'

export enum IconSource {
  'ai-shape' = require('~assets/icons/ai-shape.png'),
  'goals' = require('~assets/icons/goals.png'),
  'lightbulb' = require('~assets/icons/lightbulb.png'),
  'menu' = require('~assets/icons/menu.png'),
  'tasks' = require('~assets/icons/tasks.png'),
  'plus' = require('~assets/icons/plus.png'),
  'triple-dot' = require('~assets/icons/triple-dot.png'),
  'edit' = require('~assets/icons/edit.png'),
  'trash' = require('~assets/icons/trash.png'),
  'side-menu' = require('~assets/icons/side-menu.png'),
  'home' = require('~assets/icons/home.png'),
  'checkbox-unchecked' = require('~assets/icons/checkbox-unchecked.png'),
  'checkbox-checked' = require('~assets/icons/checkbox-checked.png'),
  'check' = require('~assets/icons/check.png'),
  'clock' = require('~assets/icons/clock.png'),
  'clock-small' = require('~assets/icons/clock-small.png'),
  'mark' = require('~assets/icons/mark.png'),
  'info' = require('~assets/icons/info.png'),
  'close' = require('~assets/icons/close.png'),
  'chevron-up' = require('~assets/icons/chevron-up.png'),
  'chevron-down' = require('~assets/icons/chevron-down.png'),
  'chevron-left' = require('~assets/icons/chevron-left.png'),
  'calendar' = require('~assets/icons/calendar.png'),
  'radiobutton-selected' = require('~assets/icons/radiobutton-selected.png'),
  'radiobutton-unselected' = require('~assets/icons/radiobutton-unselected.png'),
  'bell-on' = require('~assets/icons/bell-on.png'),
  'bell-off' = require('~assets/icons/bell-off.png'),
  'warning' = require('~assets/icons/warning.png'),
  'autotask-delay' = require('~assets/icons/autotask-delay.png'),
  'instagram' = require('~assets/icons/instagram.png'),
  'star' = require('~assets/icons/star.png'),
  'chat' = require('~assets/icons/chat.png'),
  'language' = require('~assets/icons/language.png'),
  'lock' = require('~assets/icons/lock.png'),
  'lock-unlocked' = require('~assets/icons/lock-unlocked.png'),
  'education' = require('~assets/icons/education.png'),
  'message' = require('~assets/icons/message.png'),
  'book' = require('~assets/icons/book.png'),
  'matrix' = require('~assets/icons/matrix.png'),
  'pause' = require('~assets/icons/pause.png'),
  'play' = require('~assets/icons/play.png'),
  'refresh' = require('~assets/icons/refresh.png'),
  'refresh-stop' = require('~assets/icons/refresh-stop.png'),
  'rocket' = require('~assets/icons/rocket.png'),
}

export type IconName = keyof typeof IconSource
interface IconProps extends Omit<ImageProps, 'source'> {
  name: IconName
  size?: number
}

const Icon: React.FC<IconProps> = ({ name, size = 20, style, ...props }) => {
  const source = IconSource[name]

  return (
    <Image
      source={source}
      style={[
        {
          width: size,
          height: size,
          resizeMode: 'contain',
          tintColor: Color.White,
        },
        style,
      ]}
      {...props}
    />
  )
}

export default Icon
