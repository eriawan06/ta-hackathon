import { Box, useStyleConfig } from '@chakra-ui/react'

export default function Alert({ ...rest }) {
  const styles = useStyleConfig('Alert')

  return (
    <Box
      __css={styles}
      {...rest}
    />
  )
}
