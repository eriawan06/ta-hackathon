const px = [6, 12, 24, 48]
const py = [6, 12, 12, 24]

const variantFullPage = {
  minH: '100vh',
  px,
  py
}

const variantSpaced = {
  px,
  py
}

const variantSpacedX = {
  px
}

const variantSpacedY = {
  py
}

const Container = {
  baseStyle: {
    maxWidth: 'auto'
  },
  variants: {
    fullPage: variantFullPage,
    spaced: variantSpaced,
    spacedX: variantSpacedX,
    spacedY: variantSpacedY
  },
  defaultProps: {
    variant: 'spaced'
  }
}

export default Container
