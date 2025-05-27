import { createReducer } from '@reduxjs/toolkit'
import { AppStatus, DATE_FORMAT, UserStatus } from '~/constants'
import { setAppStatus, setTasksDate, setUserStatus } from './actions'
import moment from 'moment'

const initialState = {
  appStatus: AppStatus.IDLE,
  userStatus: UserStatus.UNINITIALIZED,

  date: moment().format(DATE_FORMAT),
}

export const appReducer = createReducer(initialState, builder => {
  builder.addCase(setAppStatus, (s, a) => {
    s.appStatus = a.payload
  })
  builder.addCase(setUserStatus, (s, a) => {
    s.userStatus = a.payload
  })
  builder.addCase(setTasksDate, (s, a) => {
    s.date = a.payload
  })
})
