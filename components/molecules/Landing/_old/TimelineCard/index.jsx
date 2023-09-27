import { AspectRatio, Box, Circle, Heading, Icon } from '@chakra-ui/react'
import { transparentize } from '@chakra-ui/theme-tools'

import Card from 'components/atoms/Card'

import theme from 'theme'

export default function TimeLineCard({ icon, title, children }) {
  return (
    <Box
      pt='75%'
      h='100%'
    >
      <Card
        variant='gradient'
        gradientDir='to bottom'
        position='relative'
        h='100%'
      >
        <Box
          position='absolute'
          top='0%'
          left='50%'
          w='full'
          transform='translate(-50%, -75%)'
        >
          <AspectRatio
            ratio={1}
            w='full'
          >
            <Circle
              bgGradient={`linear(to-t, ${transparentize(
                'red.500',
                0.75
              )(theme)} 0%, transparent 25%)`}
              boxSize='100%'
              p='10%'
            >
              <Circle
                bgGradient={`linear(to-t, ${transparentize(
                  'red.500',
                  0.75
                )(theme)}, transparent)`}
                boxSize='100%'
              >
                <Icon
                  as={icon}
                  fontSize='4xl'
                />
              </Circle>
            </Circle>
          </AspectRatio>
        </Box>

        <Box pt='25%'>
          <Box p={4}>
            <Heading
              as='h3'
              fontSize='xl'
              mb={4}
            >
              {title}
            </Heading>

            <Box>{children}</Box>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
