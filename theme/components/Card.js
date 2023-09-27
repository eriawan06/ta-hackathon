import { mode, transparentize } from '@chakra-ui/theme-tools'

const hoverStyle = {
  _hover: {
    transform: 'translateY(-5%)'
  }
}

const baseStyle = (props) => {
  const { isHoverable } = props

  const baseStyle = {
    borderRadius: 'xl',
    boxShadow: 'xl',
    transitionProperty: 'common',
    transitionDuration: 'slow',
    transitionTimingFunction: 'ease-out'
  }

  return isHoverable
    ? {
        ...hoverStyle,
        ...baseStyle
      }
    : baseStyle
}

const variantGradient = (props) => {
  const { colorScheme, gradientDir } = props

  return {
    bgGradient: `linear(${
      gradientDir ?? 'to-t'
    }, ${colorScheme}.800, ${transparentize(colorScheme, 0.2)(props)})`
  }
}

const variantSolid = (props) => {
  const { colorScheme } = props

  if (colorScheme === 'gray')
    return {
      bg: `gray.800`
    }

  return {
    bg: `${colorScheme}.800`
  }
}

const variantOutline = (props) => {
  const { colorScheme } = props

  return {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: `${colorScheme}.500`,
    _hover: {
      borderColor: mode(`${colorScheme}.400`, `${colorScheme}.600`)(props)
    }
  }
}

const variantGhost = (props) => {
  const { colorScheme, theme } = props

  if (colorScheme === 'gray') {
    return {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: mode('whiteAlpha.300', 'blackAlpha.300')(props)
    }
  }

  return {
    borderColor: transparentize(`${colorScheme}.500`, 0.3)(theme)
  }
}

const Card = {
  baseStyle,
  variants: {
    outline: variantOutline,
    gradient: variantGradient,
    ghost: variantGhost,
    solid: variantSolid
  },
  defaultProps: {
    variant: 'solid',
    colorScheme: 'gray'
  }
}

export default Card
