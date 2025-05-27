import AsyncStorage from '@react-native-async-storage/async-storage'
import type { IapService as IIapService } from '.'
import crashlytics from '../firebase/crashlytics'
import {
  Purchase,
  Subscription,
  getAvailablePurchases,
  getPurchaseHistory,
  getSubscriptions,
  requestSubscription,
} from 'react-native-iap'
import {
  PLAY_MARKET_SUBSCRIPTION_GROUP_ID,
  SubscriptionAndroidSku,
  SubscriptionPlan,
} from '~/constants/iap'
import { assert } from '~/utils/assertion'
import moment from 'moment'
import analytics from '@react-native-firebase/analytics'

enum AStorageKey {
  LastInitedPurchase = 'last-inited-purchase', // :SubscriptionPlan
  PurchasedPlan = 'purchased-plan', // :SubscriptionPlan
  IsLastPurchaseTrial = 'last-purchase-is-trial', // bool
}

/** days */
const trialLength = 14

export class IapService implements IIapService {
  async isSubscribed() {

  }

  async isEligibleForTrial() {

  }

  private premiumProduct?: Subscription

  async getProducts() {

  }

  private get yearProduct() {

  }
  private get annualTrialOffer() {

  }
  private get monthProduct() {

  }
  private get monthlyTrialOffer() {

  }

  async purchaseSubscription(plan: SubscriptionPlan) {

  }

  async restorePurchases() {
  }

  async isSubscriptionPurchased(purchase: Purchase) {
 
  }

  private purchaseHistory?: Purchase[]
  private purchasedPlan?: SubscriptionPlan
  private isLastPurchaseTrial?: boolean

  async sync() {

  }

  getSubscribetAt() {

  }

  getSubscriptionExpiresAt() {

  }

  getIsTrial() {

  }
}
