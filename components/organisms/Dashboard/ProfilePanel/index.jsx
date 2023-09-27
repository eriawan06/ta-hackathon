import NextLink from 'next/link'

import {
  AspectRatio,
  Box,
  Button,
  Divider,
  Heading,
  Icon,
  Image,
  List,
  ListItem,
  Skeleton,
  Text
} from '@chakra-ui/react'

import { BsEnvelope, BsPhone, BsPinMap } from 'react-icons/bs'

import Card from 'components/atoms/Card'
import ErrorOverlay from 'components/molecules/ErrorOverlay'

import { useParticipantProfile } from 'hooks/swr/users'
import capitalizeFirst from 'libs/stringLib'
import { useState } from 'react'

export default function ProfilePanel() {
  const [isBtnEditClicked, setIsBtnEditClicked] = useState(false)

  const {
    error,
    data: participant,
    isLoading,
    mutate
  } = useParticipantProfile()

  return (
    <Card
      variant='solid'
      layerStyle='dashboardCard'
      position='relative'
      w='full'
    >
      {error && <ErrorOverlay>Unable to load user profile</ErrorOverlay>}

      <Box px={16} py={8}>
        <AspectRatio ratio='1' w='full'>
          <Image
            name={participant?.user.name}
            src={participant?.user.avatar}
            fallbackSrc='/images/avatar-fallback.png'
            alt={participant?.user.name}
            borderRadius='full'
          />
        </AspectRatio>
      </Box>

      <Divider />

      <Box p={8}>
        <Skeleton isLoaded={!isLoading}>
          <Heading as='h3' fontSize='2xl' mb={2}>
            {participant?.user.name}
          </Heading>
        </Skeleton>

        <Skeleton isLoaded={!isLoading}>
          <Text as='p' mb={10}>
            {participant?.speciality?.name ?? '-'}
          </Text>
        </Skeleton>

        <List spacing={4} mb={10}>
          <ListItem>
            <Skeleton isLoaded={!isLoading}>
              <Icon as={BsPinMap} mr={2} fontSize='0.75rem' />
              {participant?.province?.name ? capitalizeFirst(participant?.province?.name) : '-'}
            </Skeleton>
          </ListItem>

          <ListItem>
            <Skeleton isLoaded={!isLoading}>
              <Icon as={BsEnvelope} mr={2} fontSize='0.75rem' />
              {participant?.user.email}
            </Skeleton>
          </ListItem>

          <ListItem>
            <Skeleton isLoaded={!isLoading}>
              <Icon as={BsPhone} mr={2} fontSize='0.75rem' />
              {participant?.user.phone_number ?? '-'}
            </Skeleton>
          </ListItem>
        </List>

        <NextLink href='/dashboard/setting/profile' passHref>
          <Button
            as='a'
            variant='solid'
            size='lg'
            colorScheme='red'
            w='full'
            fontSize='base'
            isLoading={isBtnEditClicked}
            onClick={() => setIsBtnEditClicked(true)}
          >
            Edit Profile
          </Button>
        </NextLink>
      </Box>
    </Card>
  )
}
