import { Box, Flex } from '@chakra-ui/react'

import AvatarCard from 'components/molecules/Landing/AvatarCard'

export default function AvatarCardStack({ items }) {
  return (
    <Flex w='full'>
      {items.map((item, i, arr) => (
        <Box
          flexShrink={0}
          key={`avatar-stack-item-${i}`}
          position='relative'
          left='0'
          w='30%'
          zIndex={0}
          borderRadius='sm'
          transitionDuration='0.5s'
          _peerHover={{ left: `calc(50% - (50% / ${arr.length - 1}))` }}
          sx={{
            '&:not(:first-of-type)': {
              marginLeft: `calc(-20% + (40% / ${arr.length - 1}))`
            }
          }}
          data-peer
        >
          <AvatarCard
            name={item.name}
            occupation={item.occupation}
            institution={item.institution}
            avatar={item.avatar}
            border='1px solid'
            borderColor='blackAlpha.200'
            shadow='dark-lg'
          />
        </Box>
      ))}
    </Flex>
  )
}
