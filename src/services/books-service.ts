import { StackActions } from '@react-navigation/native'
import { t } from 'i18next'
import { makeObservable, observable } from 'mobx'
import { ScreenName } from '~/constants/navigation'
import { Book } from '~/db/models/book'
import BlobUtil from '~/modules/blob-util'
import { Toast } from '~/modules/toast'
import { navigationRef } from '~/navigation'
import { uuidStr } from '~/utils/common'

export class BooksServiceStore {
  bookToOpen?: Book = null
  downloads: number[] = []

  constructor() {
    makeObservable(this, {
      bookToOpen: observable,
      downloads: observable,
    })
  }
}

const booksServiceStore = new BooksServiceStore()

export class BooksService {
  private realm: Realm

  constructor(realm: Realm) {
    this.realm = realm
  }

  async read(book: Book) {
    booksServiceStore.bookToOpen = book

    if (
      !book.localData?.fileUri &&
      !booksServiceStore.downloads.includes(book.id)
    ) {
      try {
        const filePath = `${BlobUtil.fs.dirs.DocumentDir}/${uuidStr()}`

        Toast.show({
          type: 'info',
          text1: t('knowledge.books.downloading'),
          autoHide: false,
        })

        booksServiceStore.downloads.push(book.id)

        await BlobUtil.config({ path: filePath }).fetch(
          'GET',
          encodeURI(book.link)
        )

        this.realm.write(() => {
          if (!book.localData) {
            book.localData = {
              fileUri: filePath,
            }
          } else {
            book.localData.fileUri = filePath
          }
        })
      } catch (error) {
        console.warn('Book assets download error')
        console.warn(error)
        Toast.hide()
        Toast.show({
          type: 'info',
          text1: t('knowledge.books.download-error'),
        })
      } finally {
        Toast.hide()
        booksServiceStore.downloads = booksServiceStore.downloads.filter(
          id => id !== book.id
        )
      }
    } else if (!book.localData.fileUri) {
      return
    }

    if (booksServiceStore.bookToOpen.id === book.id && book.localData.fileUri) {
      navigationRef.current?.dispatch(
        StackActions.push(ScreenName.Reader, { bookId: book.id })
      )
    }
  }
}
