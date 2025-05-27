import { Language } from '~/constants'
import { instance } from './instance'

export class UserApi {
  static async appeal(params: {
    title: string
    email: string
    message: string
  }) {
    return await instance.post('/user/appeal', params)
  }

  static async updateCloudInfo(data: {
    externalId: string
    language: Language
    timezone: string
    installedAt: string
    lastVisitedAt: string
    subscribedAt: string | null
    subscriptionExpiresAt: string | null
    isTrial: boolean | null
    firebaseToken: string
    pushNotificationsTypeId: number
  }) {
    return await instance.post('/info/save', data)
  }

  static async saveData(data) {
    return await instance.post('/info/save/data', data)
  }
}
