import { Box, Center, Spinner } from '@chakra-ui/react'

export default function LoadingOverlay({ isFullScreen = false }) {
  const centerProps = isFullScreen
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 'overlay',
        h: '100vh',
        w: '100vw'
      }
    : {
        minH: 12
      }

  return (
    <Center {...centerProps}>
      <Box>
        <Spinner size={isFullScreen ? 'lg' : 'base'} />
      </Box>
    </Center>
  )
}
