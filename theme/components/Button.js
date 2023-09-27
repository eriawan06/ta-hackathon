import { mode, transparentize } from '@chakra-ui/theme-tools'

const variantSolid = (props) => {
  // default when no colorScheme is used
  // dark-mode  : white button w/ black text
  // light-mode : black button w/ white text

  const { colorScheme } = props

  const accessibleTextColorMap = {
    yellow: 'black',
    cyan: 'black'
  }

  if (colorScheme === 'white')
    return {
      bg: 'white',
      color: 'black',
      _hover: { bg: 'gray.100' },
      _active: { bg: 'gray.200' }
    }

  if (colorScheme === 'black')
    return {
      bg: 'black',
      color: 'white',
      _hover: { bg: 'gray.900' },
      _active: { bg: 'gray.800' }
    }

  if (colorScheme === 'gray')
    return {
      bg: `gray.800`,
      color: 'white',
      _hover: { bg: mode(`gray.700`, `gray.900`)(props) },
      _active: { bg: mode(`gray.700`, `gray.900`)(props) }
    }
  
    if (colorScheme === 'lightGray')
    return {
      bg: `gray.200`,
      color: 'white',
      _hover: { bg: 'gray.300' },
      _active: { bg: 'gray.300' }
    }

  return {
    bg: `${colorScheme}.500`,
    color: accessibleTextColorMap[colorScheme] ?? mode('black', 'white')(props),
    _hover: { bg: `${colorScheme}.${mode(600, 400)(props)}` },
    _active: { bg: `${colorScheme}.${mode(700, 300)(props)}` }
  }
}

const variantGhost = (props) => {
  const { colorScheme, theme } = props

  return {
    color: mode('black', 'white')(props),
    _hover: {
      bg: transparentize(`${colorScheme}.500`, 0.6)(theme)
    },
    _active: {
      bg: transparentize(`${colorScheme}.500`, 0.8)(theme)
    }
  }
}

const variantOutline = (props) => {
  const { colorScheme, theme } = props

  const darkHoverBg = transparentize(`${colorScheme}.400`, 0.25)(theme)
  const darkActiveBg = transparentize(`${colorScheme}.400`, 0.5)(theme)

  return {
    color: mode(`${colorScheme}.500`, `${colorScheme}.500`)(props),
    _hover: {
      bg: mode(`${colorScheme}.50`, darkHoverBg)(props)
    },
    _active: {
      bg: mode(`${colorScheme}.100`, darkActiveBg)(props)
    }
  }
}

const Button = {
  variants: {
    solid: variantSolid,
    ghost: variantGhost,
    outline: variantOutline
  }
}

export default Button
