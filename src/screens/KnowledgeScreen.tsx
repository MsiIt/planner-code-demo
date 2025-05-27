import React, { useMemo, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { ScreenComponent } from '~/@types/utils'
import BookList, {
  BookVerticalList,
} from '~/components/screens/knowledge-screen/BookList'
import KnowledgeList, {
  KnowledgeGrid,
} from '~/components/screens/knowledge-screen/KnowledgeList'
import PressableOpacity from '~/components/ui/pressable/PressableOpacity'
import Text from '~/components/ui/text/Text'
import { W_H_PADDING } from '~/styles'
import { Color } from '~/styles/color'
import {
  BottomSheetModal as BSModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import BottomSheetModal from '~/components/ui/bottom-sheet/BottomSheetModal'
import { nextFrame } from '~/utils/common'
import Icon from '~/components/ui/icons/Icon'
import { useTranslation } from 'react-i18next'
import { tmStoryGroups } from '~assets/data/tm-stories'
import { StoryGroupSource } from '~/modules/knowledge'
import PromotionOverlay from '~/components/subscription-service/PromotionOverlay'
import { useSelector } from '~/store/utils'
import { aiStoryGroups } from '~assets/data/ai-stories'
import { htgStoryGroups } from '~assets/data/htg-stories'
import { htpStoryGroups } from '~assets/data/htp-stories'
import { emStoryGroups } from '~assets/data/em-stories'

enum KnowledgeType {
  Instruments,
  Books,
  Timemanagment,
  Goals,
  Plans,
  Energy,
}

const KnowledgeScreen: ScreenComponent = ({ navigation, route }) => {
  const isSubscribed = useSelector(s => s.iap.isSubscribed)
  const { t } = useTranslation()
  const [modalType, setModalType] = useState<KnowledgeType>(
    KnowledgeType.Instruments
  )
  const [modalData, setModalData] = useState<StoryGroupSource[]>([])

  const divisionDataByType = {
    [KnowledgeType.Instruments]: {
      title: t('knowledge.div.1.title'),
      subtitle: t('knowledge.div.1.subtitle'),
    },
    [KnowledgeType.Books]: {
      title: t('knowledge.div.2.title'),
      subtitle: t('knowledge.div.2.subtitle'),
    },
    [KnowledgeType.Timemanagment]: {
      title: t('knowledge.div.3.title'),
      subtitle: t('knowledge.div.3.subtitle'),
    },
    [KnowledgeType.Energy]: {
      title: t('knowledge.div.4.title'),
      subtitle: t('knowledge.div.4.subtitle'),
    },
    [KnowledgeType.Goals]: {
      title: t('knowledge.div.5.title'),
      subtitle: t('knowledge.div.5.subtitle'),
    },
    [KnowledgeType.Plans]: {
      title: t('knowledge.div.6.title'),
      subtitle: t('knowledge.div.6.subtitle'),
    },
  }

  const bottomSheetModalRef = useRef<BSModal>()
  const snapPoints = useMemo(() => ['93%'], [])
  const open = () => bottomSheetModalRef.current?.present()
  const close = () => bottomSheetModalRef.current?.close()

  const showAllInstruments = () => {
    setModalType(KnowledgeType.Instruments)
    setModalData(aiStoryGroups)
    nextFrame().then(open)
  }
  const showAllBooks = () => {
    setModalType(KnowledgeType.Books)
    nextFrame().then(open)
  }
  const showAllTimeManagment = () => {
    setModalType(KnowledgeType.Timemanagment)
    setModalData(tmStoryGroups)
    nextFrame().then(open)
  }
  const showAllGoals = () => {
    setModalType(KnowledgeType.Goals)
    setModalData(htgStoryGroups)
    nextFrame().then(open)
  }
  const showAllPlans = () => {
    setModalType(KnowledgeType.Plans)
    setModalData(htpStoryGroups)
    nextFrame().then(open)
  }
  const showAllEnergy = () => {
    setModalType(KnowledgeType.Energy)
    setModalData(emStoryGroups)
    nextFrame().then(open)
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: isSubscribed ? 20 : 108 + 20 }}
      >
        <View style={{ paddingTop: 16, paddingHorizontal: W_H_PADDING }}>
          <Text style={{ fontSize: 28, lineHeight: 32 }}>
            {t('knowledge.title')}
          </Text>
          <Text style={{ marginTop: 8, color: Color.LightGrey }}>
            {t('knowledge.subtitle')}
          </Text>
        </View>

        <Divider />
        <View>
          <KnowledgeDivision
            title={divisionDataByType[KnowledgeType.Instruments].title}
            subtitle={divisionDataByType[KnowledgeType.Instruments].subtitle}
            items={aiStoryGroups}
            onShowAll={showAllInstruments}
          />
        </View>

        <Divider />
        <View>
          <SectionHeader
            title={divisionDataByType[KnowledgeType.Books].title}
            subtitle={divisionDataByType[KnowledgeType.Books].subtitle}
            onShowAll={showAllBooks}
          />
          <BookList />
        </View>

        <Divider />
        <View>
          <KnowledgeDivision
            title={divisionDataByType[KnowledgeType.Timemanagment].title}
            subtitle={divisionDataByType[KnowledgeType.Timemanagment].subtitle}
            items={tmStoryGroups}
            onShowAll={showAllTimeManagment}
          />
        </View>

        <Divider />
        <View>
          <KnowledgeDivision
            title={divisionDataByType[KnowledgeType.Goals].title}
            subtitle={divisionDataByType[KnowledgeType.Goals].subtitle}
            items={htgStoryGroups}
            onShowAll={showAllGoals}
          />
        </View>

        <Divider />
        <View>
          <KnowledgeDivision
            title={divisionDataByType[KnowledgeType.Plans].title}
            subtitle={divisionDataByType[KnowledgeType.Plans].subtitle}
            items={htpStoryGroups}
            onShowAll={showAllPlans}
          />
        </View>

        <Divider />
        <View>
          <KnowledgeDivision
            title={divisionDataByType[KnowledgeType.Energy].title}
            subtitle={divisionDataByType[KnowledgeType.Energy].subtitle}
            items={emStoryGroups}
            onShowAll={showAllEnergy}
          />
        </View>

        <View style={{ paddingTop: 16 }} />
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
      >
        <View
          style={{
            marginTop: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: W_H_PADDING,
          }}
        >
          <View style={{ width: 20 }} />

          <View style={{ alignItems: 'center' }}>
            <Text>{divisionDataByType[modalType].title}</Text>
            <Text
              style={{ fontSize: 12, lineHeight: 16, color: Color.LightGrey }}
            >
              {divisionDataByType[modalType].subtitle}
            </Text>
          </View>

          <View style={{ width: 20 }}>
            <PressableOpacity onPress={close}>
              <Icon name="close" />
            </PressableOpacity>
          </View>
        </View>

        <BottomSheetScrollView
          bounces={false}
          style={{ marginTop: 16 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {modalType === KnowledgeType.Books ? (
            <BookVerticalList onRequestClose={close} />
          ) : (
            <KnowledgeGrid items={modalData} />
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>

      {!isSubscribed && <PromotionOverlay />}
    </>
  )
}

const KnowledgeDivision = ({
  title,
  subtitle,
  items,
  onShowAll,
}: {
  title: string
  subtitle: string
  items: StoryGroupSource[]
  onShowAll: () => void
}) => {
  return (
    <>
      <SectionHeader title={title} subtitle={subtitle} onShowAll={onShowAll} />
      <KnowledgeList items={items} />
    </>
  )
}

const SectionHeader = ({
  title,
  subtitle,
  onShowAll,
}: {
  title: string
  subtitle: string
  onShowAll: () => void
}) => {
  const { t } = useTranslation()

  return (
    <View
      style={{
        paddingBottom: 16,
        paddingHorizontal: W_H_PADDING,
        flexDirection: 'row',
      }}
    >
      <View style={{ flex: 1, paddingRight: 20 }}>
        <Text>{title}</Text>
        <Text style={{ fontSize: 12, lineHeight: 16, color: Color.LightGrey }}>
          {subtitle}
        </Text>
      </View>

      <PressableOpacity hitSlop={25} onPress={onShowAll}>
        <Text style={{ color: Color.AccentBlue }}>{t('knowledge.all')}</Text>
      </PressableOpacity>
    </View>
  )
}

const Divider = ({ style = {} }) => {
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: Color.Grey,
          marginHorizontal: W_H_PADDING,
          marginVertical: 16,
        },
        style,
      ]}
    />
  )
}

export default KnowledgeScreen
