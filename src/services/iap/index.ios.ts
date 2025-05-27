import {
  IapIosSk2,
  Purchase,
  getProducts,
  requestSubscription,
} from 'react-native-iap'
import {
  APP_STORE_SUBSCRIPTION_GROUP_ID,
  SubscriptionIosSku,
  SubscriptionPlan,
} from '~/constants/iap'
import type { IapService as IIapService } from '.'
import { assert } from '~/utils/assertion'
import { TransactionSk2 } from 'react-native-iap/lib/typescript/src/types/appleSk2'
import crashlytics from '../firebase/crashlytics'

export class IapService implements IIapService {
  async isSubscribed() {

  }

  async isEligibleForTrial() {

  }

  async getProducts() {

  }

  async purchaseSubscription(plan: SubscriptionPlan) {

  }

  async restorePurchases() {
  }

  private annualEntitlement?: TransactionSk2
  private monthlyEntitlement?: TransactionSk2

  async sync() {

  }

  private get currentEntitlement() {

  }

  getSubscribetAt() {
  
  }

  getSubscriptionExpiresAt() {

  }

  getIsTrial() {

  }
}
