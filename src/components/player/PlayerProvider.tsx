import React, { useEffect, useRef, useState } from 'react'
import { PlayerContext } from './player-context'
import { BSModal } from '../ui/bottom-sheet/BottomSheetModal'
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
  State,
} from 'react-native-track-player'
import { useTranslation } from 'react-i18next'

const PlayerProvider = ({ children }) => {
  const playerSheetRef = useRef<BSModal>()

  const { t } = useTranslation()

  const [isActivePlayer, setIsActivePlayer] = useState(false)
  const [isPlay, setIsPlay] = useState(false)

  const [knowledge, setKnowledge] = useState({})
  const [audioLink, setAudioLink] = useState('')
  const [currentKnowledge, setCurrentKnowledge] = useState({})
  const [currentAudioLink, setCurrentAudioLink] = useState('')
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentRate, setCurrentRate] = useState(0)

  useEffect(() => {
    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer()
      await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 1,
      })
    }

    setupPlayer()

    return () => {
      TrackPlayer.reset()
    }
  }, [])

  useEffect(() => {
    const loadTrack = async () => {
      if (currentAudioLink && currentKnowledge) {
        await TrackPlayer.reset()
        await TrackPlayer.add({
          id: 15,
          url: currentAudioLink,
          title: currentKnowledge?.name ?? t(currentKnowledge?.title) ?? '',
          artist: currentKnowledge?.author ?? '',
        })

        const progress = await TrackPlayer.getProgress()
        setDuration(progress.duration)

        await TrackPlayer.play()
        setIsPlay(true)
      }
    }

    loadTrack()
  }, [currentAudioLink, currentKnowledge])

  const getCurrentDuration = async () => {
    return await TrackPlayer.getProgress().then(progress => progress.duration)
  }

  const getPlayRate = async () => {
    const rate = await TrackPlayer.getRate()
    setCurrentRate(rate)
  }

  const setPlayRate = async () => {
    if (currentRate === 1) {
      await TrackPlayer.setRate(1.25)
      setCurrentRate(1.25)
    }
    if (currentRate === 1.25) {
      await TrackPlayer.setRate(1.5)
      setCurrentRate(1.5)
    }
    if (currentRate === 1.5) {
      await TrackPlayer.setRate(1.75)
      setCurrentRate(1.75)
    }
    if (currentRate === 1.75) {
      await TrackPlayer.setRate(2)
      setCurrentRate(2)
    }
    if (currentRate === 2) {
      await TrackPlayer.setRate(1)
      setCurrentRate(1)
    }
  }

  const onSliderValueChange = async value => {
    await TrackPlayer.seekTo(value)
    setPosition(value)
  }

  useTrackPlayerEvents(
    [
      Event.PlaybackState,
      Event.PlaybackActiveTrackChanged,
      Event.PlaybackProgressUpdated,
    ],
    async event => {
      if (event.type === Event.PlaybackState) {
        const currentDuration = await getCurrentDuration()
        setDuration(currentDuration)
        getPlayRate()
        // console.log(
        //   'state',
        //   event,
        //   'currentPosition',
        //   position,
        //   'duration',
        //   duration,
        //   'rate: ',
        //   currentRate
        // )
      }

      if (event.type === Event.PlaybackActiveTrackChanged) {
        console.log('changed', event)
      }

      if (event.type === Event.PlaybackProgressUpdated) {
        setPosition(event.position)
      }
    }
  )

  const openPlayer = (item, audio) => {
    setCurrentKnowledge(item)
    setCurrentAudioLink(audio)
    setTimeout(() => {
      playerSheetRef.current?.present()
    }, 1000)
    setIsActivePlayer(true)
    setIsPlay(true)
  }

  const presentPlayer = () => {
    playerSheetRef.current?.present()
  }

  const foldPlayer = () => {
    playerSheetRef.current?.dismiss()
  }

  const togglePlayback = async () => {
    if (isPlay) {
      await TrackPlayer.pause()
    } else {
      await TrackPlayer.play()
    }

    setIsPlay(!isPlay)
  }

  const closePlayer = async () => {
    await TrackPlayer.stop()
    setIsActivePlayer(false)
    setKnowledge({})
    setCurrentKnowledge({})
    setIsPlay(false)
    setAudioLink('')
    setCurrentAudioLink('')
    setPosition(0)
    setDuration(0)
    setCurrentRate(0)
    await TrackPlayer.reset()
  }

  const contextValue = {
    playerSheetRef,
    isActivePlayer,
    isPlay,

    audioLink,
    setAudioLink,
    currentAudioLink,

    knowledge,
    setKnowledge,
    currentKnowledge,

    openPlayer,
    presentPlayer,
    foldPlayer,
    togglePlayback,

    closePlayer,

    position,
    duration,

    currentRate,
    setPlayRate,

    onSliderValueChange,
  }

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  )
}

export default PlayerProvider
