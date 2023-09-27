import { Box, useStyleConfig } from '@chakra-ui/react'

export default function Highlight({ variant, colorScheme, ...rest }) {
  const styles = useStyleConfig('Highlight', { variant, colorScheme })

  return (
    <Box
      __css={styles}
      {...rest}
    />
  )
}
