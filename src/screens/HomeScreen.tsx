import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, View } from 'react-native'
import Icon, { IconSource } from '~/components/ui/icons/Icon'
import Surface from '~/components/ui/surface/Surface'
import Text, { RNText } from '~/components/ui/text/Text'
import { W_H_PADDING } from '~/styles'
import { Menu } from 'react-native-paper'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import { Color } from '~/styles/color'
import { ScreenComponent } from '~/@types/utils'
import { useQuery, useRealm } from '~/db'
import { Category, CategoryRepository } from '~/db/models/category'
import { Goal } from '~/db/models/goal'
import { navigationStore } from '~/navigation/navigation-store'
import AddButton from '~/components/ui/buttons/AddButton'
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from 'react-native-reanimated'
import PromotionOverlay from '~/components/subscription-service/PromotionOverlay'
import { useSelector } from '~/store/utils'
import { StoriesService } from '~/components/stories-service'
import { transformStoryGroupSource } from '~/modules/knowledge'
import { goalListStoryGroup } from '~assets/data/ai-stories'
import { ModalService } from '~/components/modal-service'
import DialogModal from '~/components/modal-service/modal-components/DialogModal'
import Button from '~/components/ui/buttons/Button'
import { uuidStr } from '~/utils/common'
import crashlytics from '~/services/firebase/crashlytics'
import { taskCountByDate } from '~/modules/tasks'

const HomeScreen: ScreenComponent = ({ navigation, route }) => {
  const { t } = useTranslation()
  const isSubscribed = useSelector(s => s.iap.isSubscribed)
  const categories = useQuery(Category)
  const goals = useQuery(Goal)
  const achivedGoals = goals.filtered('active == false')

  const addCategoryHandler = () => {
    navigationStore.categoryFormRef.current.open()
  }
  const addGoalHandler = () => {
    navigationStore.goalFormRef.current.open()
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: W_H_PADDING,
          paddingBottom: isSubscribed ? 20 : 80 + 20,
        }}
      >
        <View
          style={{
            paddingVertical: 20,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Image
            source={require('~assets/images/leon-task.png')}
            style={{ width: 86.64, height: 24.7, resizeMode: 'cover' }}
          />
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Summary
            title={t('goals.total-goals-conut')}
            content={goals.length}
          />
          <Summary
            title={t('goals.goals-achived-count')}
            content={achivedGoals.length}
            style={{ marginLeft: 16 }}
          />
        </View>

        <View style={{ marginTop: 16, paddingVertical: 16 }}>
          <Text style={{ color: Color.LightGrey }}>
            {t('goals.my-categories')}
            {'  '}
            <PressableOpacity
              hitSlop={10}
              containerStyle={{ transform: [{ translateY: 5 }] }}
              onPress={() =>
                StoriesService.show(
                  transformStoryGroupSource(goalListStoryGroup).stories
                )
              }
            >
              <Icon name="info" style={{ tintColor: Color.LightGrey }} />
            </PressableOpacity>
          </Text>
        </View>

        <View>
          {categories.map((c, i) => (
            <Animated.View
              key={c.id}
              style={i > 0 && { marginTop: 8 }}
              layout={Layout.duration(100)}
              entering={FadeInRight.duration(100)}
              exiting={FadeOutLeft.duration(100)}
            >
              <CategoryItem category={c} />
            </Animated.View>
          ))}

          <View style={categories.length > 0 && { marginTop: 8 }}>
            <AddButton
              title={t('goals.add-category')}
              onPress={addCategoryHandler}
            />
          </View>
          {categories.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <AddButton title={t('goals.add-goal')} onPress={addGoalHandler} />
            </View>
          )}
        </View>
      </ScrollView>

      {!isSubscribed && <PromotionOverlay variant={2} />}
    </>
  )
}

const Summary = ({ title, content, style = {} }) => {
  return (
    <Surface style={[{ flex: 1, paddingBottom: 8 }, style]}>
      <Text>{title}</Text>
      <Text style={{ fontSize: 40, lineHeight: 56 }}>{content}</Text>
    </Surface>
  )
}

const TrashMenuIcon = ({ size }) => (
  <Icon name="trash" size={size} style={{ tintColor: Color.AccentRed }} />
)
const CategoryItem = ({ category }: { category: Category }) => {
  const { t } = useTranslation()

  if (!category.isValid()) {
    return null
  }

  const pressHandler = () => {
    navigationStore.categoryRef.current.open({ categoryId: category.id })
  }

  return (
    <Surface
      style={{ flexDirection: 'row', alignItems: 'center' }}
      onPress={pressHandler}
    >
      <Text numberOfLines={1} style={{ paddingRight: 8, flex: 1 }}>
        {category.name}
      </Text>
      <Text style={{ marginLeft: 'auto', color: '#A2A5B9' }}>
        {t('goals.goals', { count: category.goals.length })}
      </Text>

      <View style={{ marginLeft: 8 }}>
        <CategoryMenu category={category} />
      </View>
    </Surface>
  )
}

const CategoryMenu = ({ category }: { category: Category }) => {
  const { t } = useTranslation()
  const realm = useRealm()
  const [menuOpened, setMenuOpened] = useState(false)

  const openMenu = () => setMenuOpened(true)
  const closeMenu = () => setMenuOpened(false)

  const editHandler = () => {
    closeMenu()
    navigationStore.categoryFormRef.current.open({ categoryId: category.id })
  }
  const deleteHandler = async () => {
    closeMenu()

    const id = uuidStr()
    await ModalService.showModal(DialogModal, {
      id,
      title: t('warning'),
      renderBody: () => (
        <Text style={{ color: Color.LightGrey }}>
          <RNText>{t('category-deletion-modal.body.begin')} </RNText>
          <RNText style={{ color: Color.White }}>{category.name} </RNText>
          <RNText>{t('category-deletion-modal.body.end')}</RNText>
        </Text>
      ),
      renderFooter: () => (
        <View style={{ flexDirection: 'row' }}>
          <Button
            title={t('cancel')}
            containerStyle={{ flex: 1 }}
            onPress={() => ModalService.closeModal(id)}
          />
          <Button
            title={t('yes-delete')}
            containerStyle={{ flex: 1, marginLeft: 8 }}
            style={{
              backgroundColor: Color.AccentRed,
              borderColor: Color.AccentRed,
            }}
            onPress={async () => {
              ModalService.closeModal(id)
              realm.write(() => {
                crashlytics().log('category delete at CategoryMenu')
                new CategoryRepository(realm).delete(category)
              })
              taskCountByDate.clear()
            }}
          />
        </View>
      ),
    }).catch(() => 0)
  }

  return (
    <Menu
      visible={menuOpened}
      onDismiss={closeMenu}
      anchor={
        <PressableOpacity hitSlop={15} onPress={openMenu}>
          <Icon
            name="triple-dot"
            style={menuOpened && { tintColor: Color.AccentBlue }}
          />
        </PressableOpacity>
      }
      anchorPosition="bottom"
    >
      <Menu.Item
        title={t('action.edit')}
        leadingIcon={{ source: IconSource.edit, direction: 'ltr' }}
        onPress={editHandler}
      />
      <Menu.Item
        title={t('action.delete')}
        titleStyle={{ color: Color.AccentRed }}
        leadingIcon={TrashMenuIcon}
        onPress={deleteHandler}
      />
    </Menu>
  )
}

export default HomeScreen
