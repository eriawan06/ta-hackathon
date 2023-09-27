import { Box, useStyleConfig } from '@chakra-ui/react'

export default function Card({
  variant,
  colorScheme,
  gradientDir,
  isHoverable,
  ...rest
}) {
  const styles = useStyleConfig('Card', {
    variant,
    colorScheme,
    gradientDir,
    isHoverable
  })

  return (
    <Box
      __css={styles}
      {...rest}
    />
  )
}
