import {
  Heading,
  Flex,
  Box,
  AspectRatio,
  Image,
  Text,
  Button,
  IconButton,
  Tooltip,
  Skeleton,
  useDisclosure,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'

import { useFormToast } from 'hooks/form-toast'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import PopupConfirmation from 'components/molecules/PopupConfirmation'

import DashboardMainLayout from 'layouts/DashboardMainLayout'

import { useLatestEvents } from 'hooks/swr/events'
import { useDetailTeam } from 'hooks/swr/teams'

import { postTeamRequest } from 'services/teams'

DetailTeam.getLayout = (page) => {
  return (
    <DashboardMainLayout pageTitle='Team Detail'>{page}</DashboardMainLayout>
  )
}

export default function DetailTeam({ id, latestEvent, isLatestEventLoading, onBack }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const { data: latestEvent, isLoading: isLatestEventLoading } = useLatestEvents()
  const { data: team, isLoading } = useDetailTeam(id)

  return (
    <>
      <PopupConfirmation
        header={team?.name}
        body={PopupConfirmationBodyForm({
          onClose,
          eventID: latestEvent?.id,
          teamID: id
        })}
        isForm
        isOpen={isOpen}
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
        <Heading
          as='h3'
          fontSize='2xl'
        >
          Teams
        </Heading>
      </Flex>

      <Skeleton isLoaded={!isLatestEventLoading && !isLoading}>
        {team && (
          <Box
            variant='solid'
            bg='gray.700'
            borderRadius='lg'
            w='full'
            p={10}
          >
            <Flex
              direction='column'
              gap={5}
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
                  w='80%'
                  alignItems='center'
                >
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
                  <Heading
                    as='h3'
                    fontSize='2xl'
                  >
                    {team.name}
                  </Heading>
                </Flex>
                <Button
                  colorScheme='red'
                  w='100px'
                  isDisabled={team.is_requested}
                  onClick={onOpen}
                >
                  {team.is_requested ? 'Requested' : 'Join'}
                </Button>
              </Flex>

              {/* Participant */}
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
                  {team.num_of_member} /{' '}
                  {latestEvent && latestEvent.team_max_member} participants
                </Text>
              </Flex>

              {/* description */}
              <Text>{team.description}</Text>

              {/* team members */}
              <Flex>
                <Heading
                  as='h3'
                  fontSize='xl'
                  mr={3}
                >
                  Team Members:
                </Heading>
                {team.members.map((member, i) => (
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
                        h={14}
                        w={14}
                        objectFit='cover'
                        borderRadius='full'
                      />
                    </Tooltip>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Box>
        )}
      </Skeleton>
    </>
  )
}

function PopupConfirmationBodyForm({ onClose, eventID, teamID }) {
  const initialValues = {
    event_id: eventID,
    team_id: teamID,
    note: ''
  }

  const validationSchema = Yup.object().shape({
    note: Yup.string().required('Required')
  })

  const toast = useFormToast('requst-join-form')

  const handleSubmit = async (values, { resetForm }) => {
    toast.close()
    postTeamRequest(values)
      .then(() => {
        toast.send(
          'success',
          'Request Submitted!',
          'Sucessfully submit a request to join the team.'
        )
      })
      .catch((err) => {
        let title = 'Form Error!'
        let message = err.message

        if (err.response?.status === 400) {
          title = 'Request Failed!'
          message = err.response?.data.error[0]
          // message = 'Please make sure your input is valid and try again...'
        }

        toast.send('error', title, message)
      })
      .finally(() => {
        onClose()
      })
  }

  return (
    <Box pb={8}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ submitForm, errors, touched, isSubmitting }) => (
          <Form>
            Once you join the team, you can’t choose or move into another team
            <FormControl
              isRequired
              isInvalid={touched.note && errors.note}
            >
              <FormLabel htmlFor='note'>Note</FormLabel>
              <Field
                as={Textarea}
                variant='white'
                id='note'
                name='note'
                type='text'
                placeholder='Enter your note here...'
              />

              <FormErrorMessage>{errors.note}</FormErrorMessage>
            </FormControl>
            <Button
              colorScheme='red'
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
              w='full'
              type='submit'
              mt={5}
              onClick={submitForm}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
