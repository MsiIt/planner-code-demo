import { ThunkAction as RTThunkAction } from '@reduxjs/toolkit'
import store from '.'

type UnknownAction = {
  type: string
  payload: unknown
}

export type RootState = ReturnType<typeof store.getState>

export type ThunkAction<ReturnType = void> = RTThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>
