import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit'
import { rootSaga } from '~/saga/root-saga'
import { appReducer } from './app/reducer'
import { iapReducer } from './iap/reducer'

const sagaMiddleware = createSagaMiddleware()

const enhancers = []

if (__DEV__) {
  enhancers.push(require('../../reactotron-config').createEnhancer())
}

const store = configureStore({
  reducer: {
    app: appReducer,
    iap: iapReducer,
  },
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware(),
    sagaMiddleware,
  ],
  enhancers,
})

sagaMiddleware.run(rootSaga)

export default store
