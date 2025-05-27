import moment from 'moment'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, {
  FadeOut,
  ReduceMotion,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useDispatch } from 'react-redux'
import {
  BigButton,
  OnboardingFade,
  OnboardingScreen,
  OnboardingText,
} from '~/components/screens/onboarding/elements'
import { RNText } from '~/components/ui/text/Text'
import { DATE_FORMAT, Priority, TaskType, UserStatus } from '~/constants'
import { useRealm } from '~/db'
import { CategoryRepository } from '~/db/models/category'
import { GoalRepository } from '~/db/models/goal'
import { TaskRepository } from '~/db/models/task'
import { User, UserSettings } from '~/db/models/user'
import { useUser } from '~/modules/hooks/use-user'
import { initialLanguage } from '~/modules/i18n'
import { init } from '~/modules/startup'
import { navigationStore } from '~/navigation/navigation-store'
import crashlytics from '~/services/firebase/crashlytics'
import { setUserStatus } from '~/store/app/actions'
import { Color } from '~/styles/color'
import { assert } from '~/utils/assertion'
import { uuid } from '~/utils/common'
import analytics from '@react-native-firebase/analytics'
import { TimerContext } from '~/navigation/OnboardingNavigator'

const OnboardingFinishScreen = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const realm = useRealm()
  const { seconds } = useContext(TimerContext)

  const progressValue = useSharedValue(0)
  const user = useUser()
  const [nextPressed, setNextPressed] = useState(false)
  const [ready, setReady] = useState(false)

  const goToApp = () => {
    dispatch(setUserStatus(UserStatus.INITIALIZED))
  }

  const next = () => {
    analytics().logEvent('tutorial_complete', { duration_sec: seconds })

    if (ready) {
      goToApp()
      return
    }

    navigationStore.eventEmitter.emit('hide-onboarding-timer')
    setNextPressed(true)
  }

  useEffect(() => {
    navigationStore.eventEmitter.emit('show-onboarding-timer')
  }, [])

  useEffect(() => {
    // commit

    const today = moment().format(DATE_FORMAT)

    realm.write(() => {
      try {
        crashlytics().log('onbording: db writing...')

        realm.create(User, {
          _id: uuid(),
          settings: {
            language: initialLanguage,

            transferUnfinishedTasksEnabledAt: null,
            sortTasksByPriority: false,

            gratitudeAutotaskEnabledSince: route.params.gratitudeEnabled
              ? today
              : null,
            readAndCheckAutotaskEnabledSince: route.params.readingEnabled
              ? today
              : null,
            dayAnalysisAutotaskEnabledSince: route.params.analysisEnabled
              ? today
              : null,
            achivementAutotaskEnabledSince: route.params.achivementEnabled
              ? today
              : null,

            morningNotificationEnabled: true,
            morningNotificationTime: '08:00:00',
            morningNotificationId: null,
            eveningNotificationEnabled: true,
            eveningNotificationTime: '18:00:00',
            eveningNotificationId: null,

            pushNotificationTypeId: route.params.mode,

            is12hFormat: new Date().toLocaleTimeString().includes('M'),

            creatorBannerHidden: false,
            categoryBannerHidden: false,
            goalBannerHidden: false,
            creatorMessageShown: false,
            subscriptionStoriesShown: false,

            booksLoaded: false,
          } as UserSettings,
        })

        const categoryRepository = new CategoryRepository(realm)
        const fCat = categoryRepository.upsert(undefined, {
          name: t('initial-category.finance'),
        })
        const hCat = categoryRepository.upsert(undefined, {
          name: t('initial-category.health'),
        })
        const rCat = categoryRepository.upsert(undefined, {
          name: t('initial-category.relations'),
        })
        const tCat = categoryRepository.upsert(undefined, {
          name: t('initial-category.travel'),
        })

        let category: ReturnType<typeof categoryRepository.upsert>

        if (route.params.category === 5) {
          category = categoryRepository.upsert(undefined, {
            name: route.params.categoryName,
          })
        } else {
          const catByCode = {
            1: fCat,
            2: hCat,
            3: rCat,
            4: tCat,
          }

          category = catByCode[route.params.category]
        }

        assert(category, 'Category did not created')

        const goal = new GoalRepository(realm).upsert(undefined, {
          name: route.params.goalName,
          category,
          deadline: moment().add(1, 'year').format(DATE_FORMAT),
          active: true,
        })

        assert(goal, 'Goal did not created')

        new TaskRepository(realm).upsert(undefined, {
          name: route.params.taskName,
          goal,
          active: true,
          typeId: TaskType.Custom,
          priorityId: Priority.Main,
          startDate: today,
        })

        crashlytics().log('onboarding: db writing complete')
      } catch (error) {
        crashlytics().log('onboarding: db writing error')
        ErrorUtils.getGlobalHandler()(error, true)
        throw error
      }
    })
  }, [])

  useEffect(() => {
    progressValue.value = withTiming(1, {
      duration: 5000,
      reduceMotion: ReduceMotion.Never,
    })
  }, [])

  const initStarted = useRef(false)
  useEffect(() => {
    const firstLoad = async () => {
      try {
        if (user && !initStarted.current) {
          initStarted.current = true
          crashlytics().log('onboarding: init start')
          const r = await init(realm)
          crashlytics().log('onboarding: init finish')
          assert(r.userStatus === UserStatus.INITIALIZED)
          setReady(true)
        }
      } catch (error) {
        crashlytics().log('onboarding: init error')
        ErrorUtils.getGlobalHandler()(error, true)
      }
    }

    firstLoad()
  }, [user])

  useEffect(() => {
    if (ready && nextPressed) {
      cancelAnimation(progressValue)
      progressValue.value = withTiming(
        1,
        {
          duration: (5000 * (1 - progressValue.value)) / 10,
          reduceMotion: ReduceMotion.Never,
        },
        () => {
          runOnJS(goToApp)()
        }
      )
    }
  }, [ready, nextPressed])

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        // Prevent default behavior of leaving the screen
        e.preventDefault()
      }),
    [navigation]
  )

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      left: `-${(1 - progressValue.value) * 100}%`,
    }
  }, [])

  return (
    <OnboardingScreen>
      {!nextPressed && (
        <>
          <Animated.View
            exiting={FadeOut}
            style={{
              marginTop: 'auto',
              marginBottom: 'auto',
              paddingVertical: 20,
            }}
          >
            <OnboardingFade>
              <OnboardingText>{t('onboarding.finish.line-1')}</OnboardingText>
            </OnboardingFade>
            <OnboardingFade delay={200}>
              <OnboardingText style={{ marginTop: 40 }}>
                <RNText>{t('onboarding.finish.line-2.1')}</RNText>{' '}
                <RNText style={{ color: Color.AccentBlue }}>
                  {t('onboarding.finish.line-2.2')}
                </RNText>
                <RNText>{t('onboarding.finish.line-2.3')}</RNText>
              </OnboardingText>
            </OnboardingFade>
          </Animated.View>

          <OnboardingFade delay={300}>
            <Animated.View exiting={FadeOut}>
              <BigButton
                title={t('onboarding.finish.button')}
                containerStyle={{ marginTop: 20 }}
                onPress={next}
              />
            </Animated.View>
          </OnboardingFade>
        </>
      )}

      {nextPressed && (
        <View
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
            paddingVertical: 20,
          }}
        >
          <View>
            <OnboardingFade>
              <OnboardingText textStyle={{ minWidth: undefined }}>
                {t('onboarding.finish.loading')}
              </OnboardingText>
            </OnboardingFade>

            <OnboardingFade delay={300}>
              <View style={{ marginTop: 40 }}>
                <View
                  style={{
                    height: 8,
                    backgroundColor: Color.Dark,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <Animated.View
                    style={[
                      {
                        flex: 1,
                        borderRadius: 4,
                        backgroundColor: Color.AccentBlue,
                      },
                      progressBarStyle,
                    ]}
                  />
                </View>
              </View>
            </OnboardingFade>
          </View>
        </View>
      )}
    </OnboardingScreen>
  )
}

export default OnboardingFinishScreen
