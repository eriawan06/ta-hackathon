import { Box, Center, Icon } from '@chakra-ui/react'

import { BsXOctagon } from 'react-icons/bs'

export default function ErrorOverlay({ children }) {
  return (
    <Box
      position='absolute'
      inset={0}
      w='full'
      h='100%'
      bg='gray.800'
      zIndex='overlay'
    >
      <Center
        w='full'
        h='100%'
      >
        <Box>
          <Icon
            as={BsXOctagon}
            display='block'
            mx='auto'
            mb={2}
          />
          {children}
        </Box>
      </Center>
    </Box>
  )
}
