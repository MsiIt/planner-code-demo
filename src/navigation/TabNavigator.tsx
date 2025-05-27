import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { defaultScreenOptions } from './utils'
import { Color } from '~/styles/color'
import TabBar from './TabBar'
import { createStackNavigator } from '@react-navigation/stack'
import Icon, { IconName } from '~/components/ui/icons/Icon'
import { ScreenName } from '~/constants/navigation'
import HomeScreen from '~/screens/HomeScreen'
import TasksScreen from '~/screens/TasksScreen'
import KnowledgeScreen from '~/screens/KnowledgeScreen'
import MenuScreen from '~/screens/MenuScreen'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

const Tab = createBottomTabNavigator()
const TabNavigator = () => {
  const { t } = useTranslation()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.Black }}>
      <Tab.Navigator
        initialRouteName="TasksTab"
        screenOptions={{
          tabBarActiveTintColor: Color.AccentBlue,
          tabBarInactiveTintColor: Color.White,
          headerShown: false,
          tabBarLabelStyle: { textTransform: 'capitalize' },
          tabBarHideOnKeyboard: false,
        }}
        tabBar={renderTab}
      >
        <Tab.Screen
          options={{
            tabBarIcon: getIconComponent('goals'),
            tabBarLabel: t('tab-bar-label.home'),
          }}
          name="HomeTab"
          component={HomeNavigator}
        />
        <Tab.Screen
          options={{
            tabBarIcon: getIconComponent('tasks'),
            tabBarLabel: t('tab-bar-label.tasks'),
            lazy: false,
          }}
          name="TasksTab"
          component={TasksNavigator}
        />
        <Tab.Screen
          options={{
            tabBarIcon: getIconComponent('lightbulb'),
            tabBarLabel: t('tab-bar-label.knowledge'),
          }}
          name="KnowledgeTab"
          component={KnowledgeNavigator}
        />
        <Tab.Screen
          options={{
            tabBarIcon: getIconComponent('menu'),
            tabBarLabel: t('tab-bar-label.menu'),
          }}
          name="MenuTab"
          component={MenuNavigator}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

const renderTab = props => <TabBar {...props} />
const getIconComponent =
  (iconName: IconName) =>
  ({ focused, color, size }) =>
    (
      <Icon
        name={iconName}
        style={{ tintColor: color, width: size, height: size }}
      />
    )

const HomeStack = createStackNavigator()
function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={defaultScreenOptions}>
      <HomeStack.Screen name={ScreenName.Home} component={HomeScreen} />
    </HomeStack.Navigator>
  )
}

const TasksStack = createStackNavigator()
function TasksNavigator() {
  return (
    <TasksStack.Navigator screenOptions={defaultScreenOptions}>
      <TasksStack.Screen name={ScreenName.Tasks} component={TasksScreen} />
    </TasksStack.Navigator>
  )
}

const KnowledgeStack = createStackNavigator()
function KnowledgeNavigator() {
  return (
    <KnowledgeStack.Navigator screenOptions={defaultScreenOptions}>
      <KnowledgeStack.Screen
        name={ScreenName.Knowledge}
        component={KnowledgeScreen}
      />
    </KnowledgeStack.Navigator>
  )
}

const MenuStack = createStackNavigator()
function MenuNavigator() {
  return (
    <MenuStack.Navigator screenOptions={defaultScreenOptions}>
      <MenuStack.Screen name={ScreenName.Menu} component={MenuScreen} />
    </MenuStack.Navigator>
  )
}

export default TabNavigator
