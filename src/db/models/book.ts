import Realm from 'realm'
import { Timestamp } from '~/@types'
import { ModelName } from '~/constants/db'
import { ModelRepository } from '../utils'
import BlobUtil from '~/modules/blob-util'

export class BookLocalData extends Realm.Object<BookLocalData> {
  fileUri?: string
  currentPage?: number

  static schema: Realm.ObjectSchema = {
    name: 'BookLocalData',
    properties: {
      fileUri: 'string?',
      currentPage: 'int?',
    },
  }
}

export class Book extends Realm.Object<Book> {
  _id!: number
  name!: string
  author!: string
  readingLength!: number
  description!: string
  link!: string
  image!: string
  limited!: boolean
  localData!: BookLocalData
  storyBackgroundColor!: string
  createdAt!: Timestamp
  updatedAt!: Timestamp
  audio?: string

  get id() {
    return this._id
  }

  static schema: Realm.ObjectSchema = {
    name: ModelName.Book,
    primaryKey: '_id',
    properties: {
      _id: 'int',
      name: 'string',
      author: 'string',
      readingLength: 'int',
      description: 'string',
      link: 'string',
      image: 'string',
      limited: 'bool',
      localData: 'BookLocalData',
      storyBackgroundColor: 'string',
      createdAt: 'string',
      updatedAt: 'string',
      audio: 'string?',
    },
  }
}

export class BookRepository extends ModelRepository {
  delete(book: Book) {
    if (book.localData.fileUri) {
      BlobUtil.fs.unlink(book.localData.fileUri)
    }

    this.realm.delete(book)
  }
}
