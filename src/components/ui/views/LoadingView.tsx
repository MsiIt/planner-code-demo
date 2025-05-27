import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import Text from '../text/Text'
import { Color } from '~/styles/color'
import { useTranslation } from 'react-i18next'

const LoadingView = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.screen}>
      <View>
        <Text style={{ color: Color.White }}>{t('loading-view.loading')}</Text>
      </View>

      <View style={styles.indicatorContainer}>
        <ActivityIndicator color={Color.White} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.Black,
  },

  indicatorContainer: {
    position: 'absolute',
    bottom: 32,
  },
})

export default LoadingView
