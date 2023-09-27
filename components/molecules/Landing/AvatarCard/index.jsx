import { Box, AspectRatio, Flex, Heading, Image, Text } from '@chakra-ui/react'
import { transparentize } from '@chakra-ui/theme-tools'

import Card from 'components/atoms/Card'

import theme from 'theme'

export default function ProfileCard({
  avatar,
  name,
  occupation,
  institution,
  ...rest
}) {
  return (
    <Card
      isHoverable
      position='relative'
      w='full'
      h='100%'
      overflow='hidden'
      {...rest}
    >
      <Flex flexDirection='column' h='100%'>
        <AspectRatio
          ratio={1}
          w='full'
          bgGradient='linear(to-t, red.400 0%, 30%)'
        >
          <Image
            src={avatar}
            fallbackSrc='/images/avatar-fallback.png'
            alt={name}
          />
        </AspectRatio>

        <Box
          flexGrow={1}
          position='relative'
          p={4}
          pb={8}
        >
          <Heading
            as='h5'
            fontSize='xl'
            fontWeight='bold'
            mb={2}
          >
            {name}
          </Heading>

          <Text
            as='p'
            fontSize='sm'
            fontWeight='bold'
          >
            {occupation}
          </Text>

          <Text
            as='p'
            fontSize='sm'
          >
            {institution}
          </Text>

          <Box
            position='absolute'
            insetX={0}
            bottom={0}
            zIndex={10}
            h={8}
            bgGradient={`linear(to-t, ${transparentize(
              'red.500',
              0.25
            )(theme)}, transparent)`}
          />
        </Box>
      </Flex>
    </Card>
  )
}
