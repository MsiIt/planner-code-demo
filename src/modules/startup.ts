import { User } from '~/db/models/user'
import i18n from './i18n'
import { SubscriptionService } from '~/components/subscription-service'
import { DailyNotificationsModule } from './daily-notifications'
import { TaskRescheduler } from './task-rescheduler'
import { AutotasksModule } from './autotasks'
import { UserStatus } from '~/constants'
import _ from 'lodash'
import { defaultBooks } from '~assets/data/books'
import { BooksApi } from '~/api/books-api'
import { Book, BookRepository } from '~/db/models/book'
import BlobUtil from './blob-util'
import { PermissionsAndroid, Platform } from 'react-native'
import messaging from '~/services/firebase/messaging'
import crashlytics from '~/services/firebase/crashlytics'
import { initConnection } from 'react-native-iap'

const loadBooks = async (realm: Realm) => {
  crashlytics().log('book loader: start')

  try {
    const user = realm.objects(User)[0]
    const booksLoaded = user.settings.booksLoaded

    const transform = book => ({
      ..._.omit(book, 'id'),
      _id: book.id,
      limited: !!book.limited,
    })

    if (!booksLoaded) {
      realm.write(() => {
        defaultBooks.forEach(book => {
          realm.create(Book, transform(book), 'modified')
        })
        user.settings.booksLoaded = true
      })
    }

    const res = await BooksApi.get()

    realm.write(() => {
      // deleting removed books
      const actualBookIds = res.data.result.map(b => b.id)
      realm.objects(Book).map(book => {
        if (!actualBookIds.includes(book.id)) {
          new BookRepository(realm).delete(book)
        }
      })

      // updating/creating book records
      res.data.result.forEach(book => {
        const existingBook = realm.objectForPrimaryKey(Book, book.id)

        if (!existingBook || existingBook.updatedAt !== book.updatedAt) {
          if (existingBook) {
            // new BookRepository(realm).delete(existingBook)
            realm.create(Book, transform(book), 'modified')
          } else {
            realm.create(Book, transform(book))
          }
        }
      })
    })

    const books = realm.objects(Book)
    for (const book of books) {
      if (
        book.localData?.fileUri &&
        !(await BlobUtil.fs.exists(book.localData?.fileUri))
      ) {
        BlobUtil.fs.unlink(book.localData.fileUri)
        realm.write(() => {
          if (!book.localData) {
            book.localData = {
              fileUri: null,
            }
          } else {
            book.localData.fileUri = null
          }
        })
      }
    }
  } catch (error) {
    console.warn('-- books loading:', error)
  }

  crashlytics().log('book loader: finish')
}

const firebaseMessagingPermissions = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      console.log('Authorization status:', authStatus)
    }
  } else if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    )
  }
}

export const init = async (realm: Realm) => {
  const user = realm.objects(User)[0]
  const pushNotificationTypeId = user?.settings?.pushNotificationTypeId

  if (user) {
    console.log('-- initialized')

    loadBooks(realm)

    if (pushNotificationTypeId === 1) {
      await Promise.all([
        i18n.changeLanguage(user.settings.language),
        initConnection()
          .then(() => SubscriptionService.init())
          .catch(error => console.warn(error)),
      ])
    } else {
      await Promise.all([
        i18n.changeLanguage(user.settings.language),
        initConnection()
          .then(() => SubscriptionService.init())
          .catch(error => console.warn(error)),
        firebaseMessagingPermissions(),
      ])

      new DailyNotificationsModule(realm).process().catch(() => 0)
    }

    new TaskRescheduler(realm).process().catch(() => 0)
    new AutotasksModule(realm).process().catch(() => 0)

    return { userStatus: UserStatus.INITIALIZED }
  } else {
    console.log('-- uninitialized')

    return { userStatus: UserStatus.UNINITIALIZED }
  }
}
