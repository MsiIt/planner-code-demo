import { call, take, all } from 'redux-saga/effects'
import { AppStatus } from '~/constants'
import { setAppStatus } from '~/store/app/actions'
import { realmWatcher } from './realm-watcher'
import crashlytics from '~/services/firebase/crashlytics'

function* appStatusLogger(): Generator {
  while (true) {
    const action = yield take(setAppStatus.type)
    const status = AppStatus[action.payload].toLowerCase()
    const message = `app status changed to: ${status}`
    crashlytics().log(message)
    console.log(message)
  }
}

export function* rootSaga(): Generator {
  yield all([call(appStatusLogger), call(realmWatcher)])
}
