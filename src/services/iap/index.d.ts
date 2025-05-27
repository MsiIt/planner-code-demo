import { Purchase } from 'react-native-iap'
import { Timestamp } from '~/@types'
import { SubscriptionPlan } from '~/constants/iap'

declare interface Product {
  id: SubscriptionPlan
  priceText: string
  monthPriceText: string
  saving?: string
}

declare class IapService {
  isSubscribed(): Promise<boolean>
  isEligibleForTrial(): Promise<boolean>
  getProducts(): Promise<Product[]>
  purchaseSubscription(plan: SubscriptionPlan): Promise<any>
  restorePurchases(): Promise<any>

  isSubscriptionPurchased(purchase: Purchase): Promise<boolean>

  sync(): Promise<void>
  getSubscribetAt(): Timestamp | null
  getSubscriptionExpiresAt(): Timestamp | null
  getIsTrial(): boolean | null
}
