import { instance } from './instance'

export class BooksApi {
  static async get() {
    return await instance.get('/bookReviews')
  }
}
