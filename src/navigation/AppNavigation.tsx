import React from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '.'
import MainNavigator from './MainNavigator'
import { Color } from '~/styles/color'
import OnboardingNavigator from './OnboardingNavigator'
import { useSelector } from '~/store/utils'
import { UserStatus } from '~/constants'

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Color.Black,
  },
}

export const AppNavigation = () => {
  // const user = useUser()
  const userStatus = useSelector(s => s.app.userStatus)

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      {userStatus === UserStatus.INITIALIZED && <MainNavigator />}
      {userStatus === UserStatus.UNINITIALIZED && <OnboardingNavigator />}
    </NavigationContainer>
  )
}
