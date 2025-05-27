export enum Color {
  AccentBlue = '#1CA5B3',
  AccentRed = '#C8255C',

  Black = '#17181C',
  Dark = '#272A32',
  White = '#FFFFFF',
  Grey = '#383C46',
  LightGrey = '#A2A5B9',
  Transparent = 'transparent',
}

export function rgba(color: string, opacity: number) {
  const [r, g, b] = hexToRgb(color)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * @returns [R: number, G: number, B: number]
 */
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (!result) {
    return [0, 0, 0] as const
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] as const
}
