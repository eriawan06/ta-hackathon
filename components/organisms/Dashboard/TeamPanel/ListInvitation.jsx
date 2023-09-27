import { useState } from 'react'

import {
  Button,
  Heading,
  Text,
  Flex,
  Card,
  Skeleton,
  AspectRatio,
  Image,
  Box,
  Center,
  IconButton,
  Tooltip,
  SimpleGrid,
  useDisclosure
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'

import PopupConfirmation from 'components/molecules/PopupConfirmation'

// import { useLatestEvents } from 'hooks/swr/events'
import { useFormToast } from 'hooks/form-toast'
import { useInvitationDetail } from 'hooks/swr/teams'

import { getListTeamInvitation, processInvitation } from 'services/teams'

import capitalizeFirst from 'libs/stringLib'
import { useEffect } from 'react'

export default function ListInvitation({ latestEvent, isLatestEventLoading, onBack }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const { data: latestEvent, isLoading: isLatestEventLoading } = useLatestEvents()

  const [invitations, setInvitations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedInvitation, setSelectedInvitation] = useState(null)
  const [modalState, setModalState] = useState('detail')

  useEffect(() => {
    if (latestEvent) {
      handleGetListInvitation()
    }
  }, [])

  const handleGetListInvitation = () => {
    setIsLoading(true)
    getListTeamInvitation({ order: 'id,asc', limit: 50, page: 1, event_id: latestEvent.id })
      .then((res) => {
        if (res && res.status === 200) {
          const data = res.data.data.invitations
          setInvitations(data)
        }
      })
    setIsLoading(false)
  }

  const onModalClose = (isConfirm) => {
    if (isConfirm) {
      setSelectedInvitation(null)
      setInterval(() => handleGetListInvitation(), 2000); 
    }
    onClose()
  }

  return (
    <>
      <PopupConfirmation
        header={
          modalState === 'detail' ? 'Detail Invitation' : 'Confirm Invitation'
        }
        body={PopupDetailInvitation(
          onModalClose,
          selectedInvitation,
          latestEvent,
          modalState
        )}
        bodyTextAlign='left'
        isOpen={isOpen}
        isForm
        onOpen={onOpen}
        onClose={onClose}
      />
      <Flex
        direction='row'
        gap={5}
        alignItems='center'
        mb={8}
      >
        <IconButton
          variant='ghost'
          color='white'
          fontSize='24px'
          icon={<ArrowBackIcon />}
          onClick={onBack}
        />
        <Heading as='h3' fontSize='2xl'>List Invitation</Heading>
      </Flex>

      <Card
        variant='solid'
        bg='gray.700'
        borderRadius='lg'
        w='full'
        maxHeight='500px'
        overflow='hidden'
        overflowY='auto'
        mb={8}
      >
        <Skeleton isLoaded={!isLatestEventLoading && !isLoading}>
          {invitations &&
            invitations.map((data, i) => (
              <Flex
                key={`team-${i}`}
                w='full'
                borderBottom='solid 1px white'
                py={5}
                px={8}
                justifyContent='space-between'
                alignItems='center'
              >
                <Flex
                  gap={5}
                  w='70%'
                >
                  <Box w='15%'>
                    <AspectRatio ratio={1}>
                      <Image
                        name={data.name}
                        src={data.avatar}
                        fallbackSrc='/images/avatar-fallback.png'
                        alt={data.name}
                        borderRadius='full'
                      />
                    </AspectRatio>
                  </Box>
                  <Flex
                    direction='column'
                    gap={3}
                  >
                    <Heading
                      as='h3'
                      fontSize='2xl'
                    >
                      {data.name}
                    </Heading>
                    <Flex
                      gap={3}
                      alignItems='center'
                    >
                      <Image
                        src='/images/icon/participant-icon.png'
                        alt='Sagara'
                        h={8}
                      />
                      <Text>
                        {data.num_of_member} / {latestEvent.team_max_member}{' '}
                        participants
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex gap={3}>
                  <Button
                    colorScheme='gray'
                    w='100px'
                    onClick={() => {
                      setModalState('detail')
                      setSelectedInvitation(data)
                      onOpen()
                    }}
                  >
                    See
                  </Button>

                  <Button
                    colorScheme='red'
                    w='100px'
                    isDisabled={data.status !== 'sent'}
                    onClick={() => {
                      setModalState('confirm')
                      setSelectedInvitation(data)
                      onOpen()
                    }}
                  >
                    {data.status === 'sent' ? 'Confirm' : capitalizeFirst(data.status)}
                  </Button>
                </Flex>
              </Flex>
            ))}
        </Skeleton>
      </Card>
    </>
  )
}

function PopupDetailInvitation(onClose, invitationId, latestEvent, type) {
  const { data: invitationDetail, isLoading } = useInvitationDetail(
    type === 'detail' ? invitationId?.id : null
  )

  const [isBeingConfirmed, setIsBeingConfirmed] = useState(false)
  const toast = useFormToast('popup-invitation')

  const onConfirmInvitation = (status) => {
    setIsBeingConfirmed(true)
    toast.close()
    processInvitation(invitationId?.code)({ status })
      .then(() => {
        toast.send(
          'success',
          'Invitation Confirmed',
          'Sucessfully confirm the invitation'
        )
      })
      .catch((err) => {
        const title = 'Request Failed!'
        const message = err.response.data.error

        toast.send('error', title, message)
      })
    setIsBeingConfirmed(false)
    onClose(true)
  }

  return (
    <>
      {type === 'detail' ? (
        <Skeleton isLoaded={!isLoading}>
          {invitationDetail && (
            <Box
              variant='solid'
              bg='gray.700'
              borderRadius='lg'
              w='full'
              p={10}
              h='fit'
            >
              <Flex
                direction='column'
                gap={5}
                maxHeight='455px'
                overflow='auto'
              >
                {/* Header */}
                <Flex
                  w='full'
                  justifyContent='space-between'
                  alignItems='center'
                  mb={5}
                >
                  <Flex
                    gap={5}
                    w='100%'
                    alignItems='center'
                  >
                    <Box w='10%'>
                      <AspectRatio ratio={1}>
                        <Image
                          name={invitationDetail?.name}
                          src={invitationDetail?.avatar}
                          fallbackSrc='/images/avatar-fallback.png'
                          alt={invitationDetail?.name}
                          borderRadius='full'
                        />
                      </AspectRatio>
                    </Box>
                    <Heading as='h3' fontSize='2xl'>{invitationDetail?.name}</Heading>
                  </Flex>
                </Flex>

                {/* Participant */}
                <Flex gap={3} alignItems='center'>
                  <Image
                    src='/images/icon/participant-icon.png'
                    alt='Sagara'
                    h={8}
                  />
                  <Text>
                    {invitationDetail?.num_of_member} /{' '}
                    {latestEvent && latestEvent.team_max_member} participants
                  </Text>
                </Flex>

                {/* description */}
                <Text>{invitationDetail?.description}</Text>

                {/* team members */}
                <Flex>
                  <Heading as='h3' fontSize='xl' mr={3}>Team Members:</Heading>
                  {invitationDetail?.members.map((member, i) => (
                    <Flex
                      key={`teams-${i}`}
                      direction='column'
                      alignItems='center'
                      mr='-7px'
                    >
                      <Tooltip label={member.participant_name}>
                        <Image
                          src={member.participant_avatar}
                          fallbackSrc='/images/avatar-fallback.png'
                          alt='Sagara'
                          h={8}
                          w={8}
                          objectFit='cover'
                          borderRadius='full'
                        />
                      </Tooltip>
                    </Flex>
                  ))}
                </Flex>
                <Heading as='h3' fontSize='xl' mr={3}>Invitation Note :</Heading>
                <Text>{invitationDetail.note}</Text>

                {invitationDetail.status === 'sent' &&
                  <Flex gap='25px' mt='18px'>
                    <Button
                      as='a'
                      variant='solid'
                      size='lg'
                      colorScheme='red'
                      fontSize='base'
                      mb={5}
                      onClick={() => onConfirmInvitation('accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant='outline'
                      colorScheme='red'
                      size='lg'
                      color='white'
                      fontSize='base'
                      mb={5}
                      onClick={() => onConfirmInvitation('rejected')}
                    >
                      Decline
                    </Button>
                  </Flex>
                }
              </Flex>
            </Box>
          )}
        </Skeleton>
      ) : (
        <Center>
          <SimpleGrid columns={2} spacing={10} w='full'>
            <Button
              colorScheme='red'
              size='lg'
              color='white'
              fontSize='base'
              mb={5}
              isLoading={isBeingConfirmed}
              onClick={() => onConfirmInvitation('accepted')}
            >
              Accept
            </Button>
            <Button
              variant='outline'
              colorScheme='red'
              size='lg'
              color='white'
              fontSize='base'
              mb={5}
              isLoading={isBeingConfirmed}
              onClick={() => onConfirmInvitation('rejected')}
            >
              Decline
            </Button>
          </SimpleGrid>
        </Center>
      )}
    </>
  )
}
