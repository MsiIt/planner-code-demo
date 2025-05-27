import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppStatus } from '~/constants'
import { init } from '~/modules/startup'
import { setAppStatus, setUserStatus } from '~/store/app/actions'
import { useSelector } from '~/store/utils'
import BootSplash from 'react-native-bootsplash'
import { useRealm } from '~/db'
import crashlytics from '~/services/firebase/crashlytics'
import { useUserAnalyticsProps } from '~/modules/hooks/use-user-analytics-props'
import analytics from '@react-native-firebase/analytics'

const StartupService = () => {
  const realm = useRealm()
  const dispatch = useDispatch()
  const appStatus = useSelector(s => s.app.appStatus)
  const props = useUserAnalyticsProps()

  useEffect(() => {
    const setUserProps = async () => {
      for (const [key, value] of Object.entries(props)) {
        await analytics().setUserProperty(key, value)
      }
    }

    const fire = async () => {
      try {
        dispatch(setAppStatus(AppStatus.STARTING))
        crashlytics().log('startup service: init start')
        const sr = await init(realm)
        crashlytics().log('startup service: init finish')
        dispatch(setUserStatus(sr.userStatus))
        dispatch(setAppStatus(AppStatus.UP))
        BootSplash.hide({ fade: true })
        await setUserProps()
      } catch (error) {
        crashlytics().log('startup service: init error')
        ErrorUtils.getGlobalHandler()(error, true)
      }
    }

    if (appStatus === AppStatus.IDLE) {
      fire()
    }
  }, [appStatus])

  return null
}

export default StartupService
