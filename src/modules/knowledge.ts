import { Story } from '~/components/stories-service'

export interface StoryGroupSource {
  id: number
  backgroundColor: string
  previewTextColor?: string
  isSubscription?: boolean
  limited?: boolean
  stories: {
    imageSize: [number, number]
  }[]
}

export const transformStoryGroupSource = (group: StoryGroupSource) => {
  const { id, isSubscription } = group

  const title = `story-group.${id}.title`

  return {
    id: group.id,
    thumbnailUri: `https://mtplanner.store/storiesImages/${id}-thumbnail.jpg`,
    isSubscription,
    previewTextColor: group.previewTextColor,
    title,
    limited: group.limited,
    stories: group.stories.map((story, i): Story => {
      const key = i + 1
      return {
        id: i,
        imageSrc: {
          uri: `https://mtplanner.store/storiesImages/${id}-${key}.jpg`,
        },
        isSubscription,
        imageSize: story.imageSize,
        backgroundColor: group.backgroundColor,
        headTitle: title,
        title: i === 0 ? title : '',
        limited: i > 0 && group.limited,
        text: `story-group.${id}.story.${key}.text`,
      }
    }),
  }
}

export type KnowledgeListItem = ReturnType<typeof transformStoryGroupSource>
