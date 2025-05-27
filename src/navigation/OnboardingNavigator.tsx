import React, { createContext, useEffect, useState } from 'react'
import { StackHeaderProps, createStackNavigator } from '@react-navigation/stack'
import { defaultScreenOptions } from './utils'
import { ScreenName } from '~/constants/navigation'
import OnboardingStartScreen from '~/screens/onboarding/OnboardingStartScreen'
import { View } from 'react-native'
import OnboardingSplitIntroScreen from '~/screens/onboarding/OnboardingSplitIntroScreen'
import OnboardingAppPurposeScreen from '~/screens/onboarding/OnboardingAppPurposeScreen'
import OnboardingTimer from '~/components/screens/onboarding/OnboardingTimer'
import { W_H_PADDING } from '~/styles'
import OnboardingGoalNameScreen from '~/screens/onboarding/OnboardingGoalNameScreen'
import OnboardingCategoryScreen from '~/screens/onboarding/OnboardingCategoryScreen'
import OnboardingTaskNameScreen from '~/screens/onboarding/OnboardingTaskNameScreen'
import OnboardingTaskSaveScreen from '~/screens/onboarding/OnboardingTaskSaveScreen'
import OnboardingSettingsIntroScreen from '~/screens/onboarding/OnboardingSettingsIntroScreen'
import OnboardingAutotaskAchivementScreen from '~/screens/onboarding/OnboardingAutotaskAchivementScreen'
import OnboardingAutotaskGratitudeScreen from '~/screens/onboarding/OnboardingAutotaskGratitudeScreen'
import OnboardingAutotaskAnalysisScreen from '~/screens/onboarding/OnboardingAutotaskAnalysisScreen'
import OnboardingAutotaskReadingScreen from '~/screens/onboarding/OnboardingAutotaskReadingScreen'
import OnboardingFinishScreen from '~/screens/onboarding/OnboardingFinishScreen'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Color, rgba } from '~/styles/color'
import { navigationStore } from './navigation-store'
import Animated, { FadeOut } from 'react-native-reanimated'
import OnboardingNotificationsScreen from '~/screens/onboarding/OnboardingNotificationsScreen'
import LinearGradient from 'react-native-linear-gradient'
import OnboardingLanguageScreen from '~/screens/onboarding/OnboardingLanguageScreen'
import OnboardingAIAdvertisementScreen from '~/screens/onboarding/OnboardingAIAdvertisement'
import OnboardingPushSettingsScreen from '~/screens/onboarding/OnboardingPushSettingsScreen'
import OnboardingPushConfirmationScreen from '~/screens/onboarding/OnboardingPushConfirmationScreen'

const OnboardingStack = createStackNavigator()

const length = 120

export const TimerContext = createContext({})

export default function OnboardingNavigator() {
  const [seconds, setSeconds] = useState(length)

  const timerContextValue = {
    seconds,
    setSeconds,
  }

  return (
    <TimerContext.Provider value={timerContextValue}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Color.Black }}>
        <OnboardingStack.Navigator
          initialRouteName={ScreenName.OnboardingLanguage}
          screenOptions={{ ...defaultScreenOptions }}
        >
          {/* <OnboardingStack.Screen
          name={ScreenName.OnboardingLanguage}
          component={OnboardingLanguageScreen}
        /> */}
          <OnboardingStack.Screen
            name={ScreenName.OnboardingStart}
            component={OnboardingStartScreen}
          />

          <OnboardingStack.Screen
            name={ScreenName.OnboardingTimered}
            options={{ header: TimeredHeader, headerShown: true }}
            component={TimeredNavigator}
          />
        </OnboardingStack.Navigator>
      </SafeAreaView>
    </TimerContext.Provider>
  )
}

const TimeredStack = createStackNavigator()
const TimeredNavigator = () => {
  return (
    <TimeredStack.Navigator
      initialRouteName={ScreenName.OnboardingSplitIntro}
      screenOptions={{ ...defaultScreenOptions }}
    >
      <OnboardingStack.Screen
        name={ScreenName.OnboardingSplitIntro}
        component={OnboardingSplitIntroScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingAppPurpose}
        component={OnboardingAppPurposeScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingGoalName}
        component={OnboardingGoalNameScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingCategory}
        component={OnboardingCategoryScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingTaskName}
        component={OnboardingTaskNameScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingAiAdvertisement}
        component={OnboardingAIAdvertisementScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingTaskSave}
        component={OnboardingTaskSaveScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingSettingsIntro}
        component={OnboardingSettingsIntroScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingPushSettings}
        component={OnboardingPushSettingsScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingPushConfirmation}
        component={OnboardingPushConfirmationScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingAutotaskAchivement}
        component={OnboardingAutotaskAchivementScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingAutotaskGratitude}
        component={OnboardingAutotaskGratitudeScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingAutotaskAnalysis}
        component={OnboardingAutotaskAnalysisScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingAutotaskReading}
        component={OnboardingAutotaskReadingScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingNotifications}
        component={OnboardingNotificationsScreen}
      />
      <OnboardingStack.Screen
        name={ScreenName.OnboardingFinish}
        component={OnboardingFinishScreen}
      />
    </TimeredStack.Navigator>
  )
}

const TimeredHeader: React.FC<StackHeaderProps> = () => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    return navigationStore.eventEmitter.on('hide-onboarding-timer', () => {
      setVisible(false)
    })
  }, [])
  useEffect(() => {
    return navigationStore.eventEmitter.on('show-onboarding-timer', () => {
      setVisible(true)
    })
  }, [])

  return (
    <View
      style={{
        marginLeft: W_H_PADDING,
        paddingVertical: 5,
      }}
    >
      {visible && (
        <Animated.View exiting={FadeOut}>
          <OnboardingTimer />
        </Animated.View>
      )}

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <LinearGradient
          colors={[Color.Black, rgba(Color.Black, 0)]}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 15,
            top: 0,
          }}
        />
      </View>
    </View>
  )
}
