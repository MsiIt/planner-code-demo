import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native'
import moment, { Moment } from 'moment'
import React from 'react'

export interface ScreenComponentProps {
  navigation: NavigationProp<ParamListBase>
  route: RouteProp<ParamListBase, string>
}

export type ScreenComponent = React.FC<ScreenComponentProps>

/** unwrap objcect from realm model */
export type ModelObject<T> = Omit<
  T,
  | '_objectKey'
  | 'addListener'
  | 'entries'
  | 'getPropertyType'
  | 'isValid'
  | 'keys'
  | 'linkingObjects'
  | 'linkingObjectsCount'
  | 'objectSchema'
  | 'removeAllListeners'
  | 'removeListener'
  | 'toJSON'
>

export type Measure = { x: number; y: number; width: number; height: number }

export type MomentConstructor = (...params: Parameters<typeof moment>) => Moment
