import { createReducer } from '@reduxjs/toolkit'
import {
  setAnnualSubInfo,
  setIsEligibleForTrial,
  setIsSubscribed,
  setMonthlySubInfo,
} from './actions'
import { Product } from '~/services/iap'

const initialState = {
  isSubscribed: false,
  isEligibleForTrial: false,
  annualSubInfo: null as null | Product,
  monthlySubInfo: null as null | Product,
}

export const iapReducer = createReducer(initialState, builder => {
  builder.addCase(setIsSubscribed, (s, a) => {
    s.isSubscribed = a.payload
  })
  builder.addCase(setIsEligibleForTrial, (s, a) => {
    s.isEligibleForTrial = a.payload
  })
  builder.addCase(setAnnualSubInfo, (s, a) => {
    s.annualSubInfo = a.payload
  })
  builder.addCase(setMonthlySubInfo, (s, a) => {
    s.monthlySubInfo = a.payload
  })
})
