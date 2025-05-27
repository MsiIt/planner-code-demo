import { DefaultTheme } from 'react-native-paper'
import { FontFamily } from './typography'
import { Color } from './color'

export const paperTheme: typeof DefaultTheme = {
  ...DefaultTheme,
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    bodyLarge: {
      ...DefaultTheme.fonts.bodyLarge,
      fontFamily: FontFamily.Primary,
      fontSize: 14,
      lineHeight: 20,
    },
  },
  colors: {
    ...DefaultTheme.colors,

    primary: Color.AccentBlue,
    primaryContainer: Color.AccentBlue,
    secondary: 'red',
    secondaryContainer: 'red',
    tertiary: 'red',
    tertiaryContainer: 'red',
    surface: 'red',
    surfaceVariant: 'red',
    surfaceDisabled: 'red',
    background: 'red',
    error: 'red',
    errorContainer: 'red',
    onPrimary: 'red',
    onPrimaryContainer: 'red',
    onSecondary: 'red',
    onSecondaryContainer: 'red',
    onTertiary: 'red',
    onTertiaryContainer: 'red',
    onSurface: Color.White, // option menu title text
    onSurfaceVariant: Color.White, // ripple effect
    onSurfaceDisabled: 'red',
    onError: 'red',
    onErrorContainer: 'red',
    onBackground: 'red',
    outline: 'red',
    outlineVariant: 'red',
    inverseSurface: 'red',
    inverseOnSurface: 'red',
    inversePrimary: 'red',
    shadow: 'red',
    scrim: 'red',
    backdrop: 'transparent',
    elevation: {
      level0: 'red',
      level1: 'red',
      level2: Color.Dark, // option menu background
      level3: 'red',
      level4: 'red',
      level5: 'red',
    },
  },
}
