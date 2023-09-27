import {
  Heading,
  Flex,
  Box,
  AspectRatio,
  Image,
  Text,
  Button,
  Skeleton,
  useDisclosure,
  Grid,
  Card
} from '@chakra-ui/react'

import PopupConfirmation from 'components/molecules/PopupConfirmation'
import PreviewProfileCard from 'components/organisms/PreviewProfileCard/index'

import DashboardMainLayout from 'layouts/DashboardMainLayout'

import { useLatestEvents } from 'hooks/swr/events'
import {
  useMyMember,
  useMyRequest,
  useMyInvitation,
  useTeamInvitationDetail,
  useTeamRequestDetail
} from 'hooks/swr/teams'
import { useParticipantProfile } from 'hooks/swr/users'
import { processTeamRequest, removeTeamMember } from 'services/teams'
import { useFormToast } from 'hooks/form-toast'

import { useRouter } from 'next/router'
import { useState } from 'react'

import capitalizeFirst from 'libs/stringLib'
import dayjs from 'dayjs'

MyTeam.getLayout = (page) => {
  return <DashboardMainLayout pageTitle='My Team'>{page}</DashboardMainLayout>
}

export default function MyTeam({
  latestEvent,
  isLatestEventLoading,
  participantProfile,
  isParticipantProfileLoading,
  team,
}) {
  const router = useRouter()
  const toast = useFormToast('my-team')

  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()
  // const { data: latestEvent, isLoading: isLatestEventLoading } = useLatestEvents()
  // const { data: participantProfile, isLoading: isParticipantProfileLoading} = useParticipantProfile()

  const { data: members, isLoading: loadingMember, mutate: refreshMember } = useMyMember(team.id)
  const { data: requests, isLoading: loadingRequest, mutate: refreshRequest } = useMyRequest(team.id)
  const { data: invitations, isLoading: loadinginvitation } = useMyInvitation(team.id)

  const [type, setType] = useState('');
  const [id, setId] = useState(null);

  const handleClickDetail = (type, id) => {
    setType(type)
    setId(id)
    onDetailOpen()
  }

  const handleCloseDetail = () => {
    setType('')
    setId(null)
    onDetailClose()
  }

  const handleProcessRequest = ({ code, status }) => {
    toast.send('success', 'Processing The Request...')

    processTeamRequest(code)({ status })
      .then(() => {
        toast.close()
        toast.send(
          'success',
          'Request Processed',
          'Sucessfully process the request'
        )
      })
      .catch((err) => {
        const title = 'Process Failed!'
        const message = err.response.data.error

        toast.close()
        toast.send('error', title, message)
      })

    setTimeout(() => refreshRequest(), 1000);
  }

  const handleRemoveMember = (teamMemberId) => {
    toast.send('success', 'Removing Member...')

    removeTeamMember(teamMemberId)
      .then(() => {
        toast.close()
        toast.send(
          'success',
          'Member Removed',
          'Sucessfully remove member'
        )
      })
      .catch((err) => {
        const title = 'Remove Failed!'
        const message = err.response.data.error

        toast.close()
        toast.send('error', title, message)
      })

    setTimeout(() => refreshMember(), 1000);
  }

  return (
    <>
      <PopupConfirmation
        header={`Detail ${type === 'request' ? 'Request' : 'Invitation'}`}
        body={DetailPopup({ type, id })}
        isOpen={isDetailOpen}
        onOpen={onDetailOpen}
        onClose={handleCloseDetail}
        minW="700px"
        isForm
      />

      {/* wrapper */}
      <Box display='flex' flexDirection='column' gap={39}>
        {/* My team */}
        <Box
          variant='solid'
          layerStyle='dashboardCard'
          w='full'
          p={8}
          overflow='hidden'
          maxHeight='700px'
          borderRadius='lg'
        >
          <Flex direction='row' gap={5} alignItems='center' mb={8}>
            <Heading as='h3' fontSize='2xl'>My Team</Heading>
          </Flex>

          <Skeleton isLoaded={!isLatestEventLoading && team}>
            {team && (
              <Box
                variant='solid'
                bg='gray.700'
                borderRadius='lg'
                w='full'
                p={10}
              >
                <Flex direction='column' gap={5}>
                  {/* Header */}
                  <Flex w='full' justifyContent='space-between' alignItems='center' mb={5}>
                    <Flex gap={5} w='80%' alignItems='center'>
                      <Box w='10%'>
                        <AspectRatio ratio={1}>
                          <Image
                            name={team.name}
                            src={team.avatar}
                            fallbackSrc='/images/avatar-fallback.png'
                            alt={team.name}
                            borderRadius='full'
                          />
                        </AspectRatio>
                      </Box>
                      <Heading as='h3' fontSize='2xl'>{team.name}</Heading>
                    </Flex>
                    
                    {participantProfile.id === team.participant_id &&
                      <Button colorScheme='red' w='100px' onClick={() => router.push('/dashboard/create-team')}>
                        Edit
                      </Button>
                    }
                  </Flex>

                  {/* Participant */}
                  <Flex gap={3} alignItems='center'>
                    <Image src='/images/icon/participant-icon.png' alt='Sagara' h={8} />
                    <Text>
                      {team.num_of_member} /{' '}
                      {latestEvent && latestEvent.team_max_member} participants
                    </Text>
                  </Flex>

                  {/* description */}
                  <Text>{team.description}</Text>
                </Flex>
              </Box>
            )}
          </Skeleton>
        </Box>

        {/* members */}
        <Skeleton isLoaded={!loadingMember && !isParticipantProfileLoading && members}>
          <Box
            variant='solid'
            layerStyle='dashboardCard'
            w='full'
            p={8}
            overflow='hidden'
            maxHeight='700px'
            borderRadius='lg'
          >
            <Flex direction='row' gap={5} alignItems='center' mb='28px'>
              <Heading as='h3' fontSize='2xl'>Members</Heading>
            </Flex>

            {participantProfile.id === team.participant_id &&
              <Button
                colorScheme='red'
                w='126px'
                mb='21px'
                onClick={() => router.push('/dashboard/search-participant')}
              >
                Add Member
              </Button>
            }

            <Grid
              flexDirection='column'
              gap={7}
              h='fit'
              maxHeight='474px'
              overflow='auto'
              pr='40px'
            >
              {members?.map((member) => (
                <PreviewProfileCard
                  key={member.id}
                  removeAction={participantProfile.id === team.participant_id && !member.is_admin}
                  removeOnClick={() => handleRemoveMember(member.team_member_id)}
                  data={member}
                  isAdmin={member.is_admin}
                />
              ))}
            </Grid>
          </Box>
        </Skeleton>

        {/* Request Join */}
        <Skeleton isLoaded={!loadingRequest && requests}>
          <Box
            variant='solid'
            layerStyle='dashboardCard'
            w='full'
            p={8}
            overflow='hidden'
            maxHeight='700px'
            borderRadius='lg'
          >
            <Flex direction='row' gap={5} alignItems='center' mb={8}>
              <Heading as='h3' fontSize='2xl'>Request Join</Heading>
            </Flex>
            <Grid
              flexDirection='column'
              gap={7}
              h='fit'
              maxHeight='474px'
              overflow='auto'
              pr='40px'
            >
              {requests?.map((request, key) => (
                <PreviewProfileCard
                  acceptAction={participantProfile.id === team.participant_id && request.request_status === 'sent'}
                  acceptOnClick={() => handleProcessRequest({ code: request.request_code, status: 'accepted' })}
                  declineAction={participantProfile.id === team.participant_id && request.request_status === 'sent'}
                  declineOnClick={() => handleProcessRequest({ code: request.request_code, status: 'rejected' })}
                  seeAction
                  seeOnClick={() => handleClickDetail('request', request.request_id)}
                  key={key}
                  data={request}
                />
              ))}
              {requests?.length === 0 && 'No Request Found...'}
            </Grid>
          </Box>
        </Skeleton>

        {/* Invitation */}
        <Skeleton isLoaded={!loadinginvitation && invitations}>
          <Box
            variant='solid'
            layerStyle='dashboardCard'
            w='full'
            p={8}
            overflow='hidden'
            maxHeight='700px'
            borderRadius='lg'
          >
            <Flex
              direction='row'
              gap={5}
              alignItems='center'
              mb={8}
            >
              <Heading
                as='h3'
                fontSize='2xl'
              >
                Invitation
              </Heading>
            </Flex>
            <Grid
              flexDirection='column'
              gap={7}
              h='fit'
              maxHeight='474px'
              overflow='auto'
              pr='40px'
            >
              {invitations?.map((invitation, key) => (
                <PreviewProfileCard
                  key={key}
                  seeAction
                  seeOnClick={() => handleClickDetail('invitation', invitation.invitation_id)}
                  data={invitation}
                />
              ))}
            </Grid>
          </Box>
        </Skeleton>
      </Box>
    </>
  )
}

function DetailPopup({ type, id }) {
  const { data: detailInvitation } = useTeamInvitationDetail(type === 'invitation' ? id : null)
  const { data: detailRequest } = useTeamRequestDetail(type === 'request' ? id : null)

  return (
    <Box h={350} overflowY='scroll' textAlign='left'>
      {detailInvitation && (
        <Flex flexDirection='column' gap={7}>
          <PreviewProfileCard data={detailInvitation} />
          <Card w='full' variant='solid' layerStyle='dashboardCard' minHeight='223px' borderRadius='12px' pb='15px'>
            <Box textAlign='left' p='28px'>
              <Heading as='h4' size='md' mb={9}>
                Invitation Info
              </Heading>
              <Grid templateColumns='repeat(2, 1fr)' gap={8}>
                <Flex flexDirection='column' gap={3}>
                  <Box fontSize='14px' fontWeight='bold'>
                    <Text>Status</Text>
                  </Box>
                  <Box>{capitalizeFirst(detailInvitation.invitation_status)}</Box>
                </Flex>
                <Flex flexDirection='column' gap={3}>
                  <Box fontSize='14px' fontWeight='bold'>
                    <Text>Created At</Text>
                  </Box>
                  <Box>{detailInvitation.invitation_created_at ? dayjs(detailInvitation.invitation_created_at).format('YYYY-MM-DD HH:mm:ss') : '-'}</Box>
                </Flex>
                <Flex flexDirection='column' gap={3}>
                  <Box fontSize='14px' fontWeight='bold'>
                    <Text>Updated At</Text>
                  </Box>
                  <Box>{detailInvitation.invitation_updated_at ? dayjs(detailInvitation.invitation_updated_at).format('YYYY-MM-DD HH:mm:ss') : '-'}</Box>
                </Flex>
                <Flex flexDirection='column' gap={3}>
                  <Box fontSize='14px' fontWeight='bold'>
                    <Text>Proceed At</Text>
                  </Box>
                  <Box>{detailInvitation.invitation_proceed_at ? dayjs(detailInvitation.invitation_proceed_at).format('YYYY-MM-DD HH:mm:ss') : '-'}</Box>
                </Flex>
              </Grid>
              <Flex flexDirection='column' gap={3} pt={8}>
                <Box fontSize='14px' fontWeight='bold'>
                  <Text>Note</Text>
                </Box>
                <Box>{detailInvitation.invitation_note}</Box>
              </Flex>
            </Box>
          </Card>
        </Flex>
      )}

      {detailRequest && (
        <Flex flexDirection='column' gap={7}>
          <PreviewProfileCard data={detailRequest} />
          <Card w='full' variant='solid' layerStyle='dashboardCard' minHeight='223px' borderRadius='12px' pb='15px'>
            <Box textAlign='left' p='28px'>
              <Heading as='h4' size='md' mb={9}>
                Request Info
              </Heading>
              <Grid templateColumns='repeat(2, 1fr)' gap={8}>
                <Flex flexDirection='column' gap={3}>
                  <Box fontSize='14px' fontWeight='bold'>
                    <Text>Status</Text>
                  </Box>
                  <Box>{capitalizeFirst(detailRequest.request_status)}</Box>
                </Flex>
                <Flex flexDirection='column' gap={3}>
                  <Box fontSize='14px' fontWeight='bold'>
                    <Text>Created At</Text>
                  </Box>
                  <Box>{detailRequest.request_created_at ? dayjs(detailRequest.request_created_at ?? '-').format('YYYY-MM-DD HH:mm:ss') : '-'}</Box>
                </Flex>
                <Flex flexDirection='column' gap={3}>
                  <Box fontSize='14px' fontWeight='bold'>
                    <Text>Updated At</Text>
                  </Box>
                  <Box>{detailRequest.request_updated_at ? dayjs(detailRequest.request_updated_at ?? '-').format('YYYY-MM-DD HH:mm:ss') : '-'}</Box>
                </Flex>
                <Flex flexDirection='column' gap={3}>
                  <Box fontSize='14px' fontWeight='bold'>
                    <Text>Proceed At</Text>
                  </Box>
                  <Box>{detailRequest.request_proceed_at ? dayjs(detailRequest.request_proceed_at ?? '-').format('YYYY-MM-DD HH:mm:ss') : '-'}</Box>
                </Flex>
              </Grid>
              <Flex flexDirection='column' gap={3} pt={8}>
                <Box fontSize='14px' fontWeight='bold'>
                  <Text>Note</Text>
                </Box>
                <Box>{detailRequest.request_note}</Box>
              </Flex>
            </Box>
          </Card>
        </Flex>
      )}
    </Box>
  )
}