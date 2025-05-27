import { createAction } from '@reduxjs/toolkit'
import { Product } from '~/services/iap'

export const setIsSubscribed = createAction<boolean>('iap/set-is-subscribed')
export const setIsEligibleForTrial = createAction<boolean>(
  'iap/set-is-eligible-for-trial'
)
export const setAnnualSubInfo = createAction<Product>('iap/set-annual-sub-info')
export const setMonthlySubInfo = createAction<Product>(
  'iap/set-monthly-sub-info'
)
