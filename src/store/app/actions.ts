import { createAction } from '@reduxjs/toolkit'
import { AppStatus, UserStatus } from '~/constants'

export const setAppStatus = createAction<AppStatus>('set-app-status')
export const setUserStatus = createAction<UserStatus>('set-user-status')
export const setTasksDate = createAction<string>('set-tasks-date')
