import { NativeModules } from 'react-native'
import Reactotron, { trackGlobalErrors } from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'

const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0]

const reactotron = Reactotron.configure({ host })
  .useReactNative()
  .use(reactotronRedux())
  .use(sagaPlugin())
  .use(trackGlobalErrors())

module.exports = reactotron.connect()
