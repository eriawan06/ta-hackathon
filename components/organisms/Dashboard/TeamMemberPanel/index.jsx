import {
  Avatar,
  Box,
  AvatarGroup,
  Divider,
  Heading,
  Tooltip
} from '@chakra-ui/react'

import Card from 'components/atoms/Card'

export default function TeamMemberPanel() {
  return (
    <Card
      variant='solid'
      layerStyle='dashboardCard'
      position='relative'
      w='full'
    >
      <Box
        p={8}
        pb={4}
      >
        <Heading
          as='h3'
          fontSize='2xl'
        >
          <Tooltip
            label='Coming soon...!'
            hasArrow
            placement='right'
          >
            Team Member
          </Tooltip>
        </Heading>
      </Box>

      <Divider />

      <Box
        p={8}
        pt={4}
      >
        <AvatarGroup spacing={4}>
          {[0, 1, 2].map((i) => (
            <Avatar
              key={`team-member-placeholder-${i}`}
              src='/images/avatar-fallback.png'
            />
          ))}
        </AvatarGroup>
      </Box>
    </Card>
  )
}
