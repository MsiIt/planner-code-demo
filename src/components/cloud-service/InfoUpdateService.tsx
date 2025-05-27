import React from 'react'
import { useEffect } from 'react'
import { getUniqueId } from 'react-native-device-info'
import { getTimeZone } from 'react-native-localize'
import { UserApi } from '~/api/user-api'
import { timestamp } from '~/db/utils'
import { useUser } from '~/modules/hooks/use-user'
import { useSelector } from '~/store/utils'
import { SubscriptionService } from '../subscription-service'
import { User } from '~/db/models/user'
import { Platform } from 'react-native'
import messaging from '~/services/firebase/messaging'
import installations from '~/services/firebase/installations'

const InfoUpdateService = () => {
  const user = useUser()

  if (!user) {
    return null
  }

  return <Service user={user} />
}

const lastVisitedAt = timestamp()

const Service: React.FC<{ user: User }> = ({ user }) => {

  return null
}

export default InfoUpdateService
