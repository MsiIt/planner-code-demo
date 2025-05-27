import messaging from '@react-native-firebase/messaging'
import { EventEmitter } from '~/utils/event-emitter'

type event = 'message'
export const messagingEmitter = new EventEmitter<event>()

messaging().setBackgroundMessageHandler(async message => {
  console.log(
    'FM messaging | background message',
    JSON.stringify(message, null, 2)
  )

  // process message if it was received in terminated state

  await Promise.all(messagingEmitter.altEmit('message', message))
})

export default messaging
