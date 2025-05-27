import { instance } from './instance'

export class AIApi {
  static async getAITasks(data) {
    return await instance.post('/ai/detail-goal', data)
  }
}
