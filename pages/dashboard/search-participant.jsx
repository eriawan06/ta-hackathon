import {
  Grid,
  Button,
  Center,
  VStack,
  HStack,
  Heading,
  useDisclosure,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea
} from '@chakra-ui/react'
import {
  Bs4SquareFill,
  Bs0Square,
} from 'react-icons/bs'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import DashboardSearchParticipant from 'layouts/DashboardSearchParticipant'
import PreviewProfileCard from 'components/organisms/PreviewProfileCard/index'
import PopupConfirmation from 'components/molecules/PopupConfirmation'

import React, { useState, useEffect, } from 'react'

import { getParticipantSearch } from 'services/users'
import { postInvitation } from 'services/teams'

import { useFormToast } from 'hooks/form-toast'
import { useLatestEvents } from 'hooks/swr/events'
import { useMyTeam } from 'hooks/swr/teams'

export default function SearchParticipant() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: latestEvent } = useLatestEvents()
  const { data: myTeam } = useMyTeam()

  const [sort, setSort] = useState({ by: 'name', type: 'asc' })
  const [search, setSearch] = useState({ specialities: [], skills: [], search: '' });
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({ limit: 5, page: 1, totalPage: 1, totalData: 0 })
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  useEffect(() => {
    resetPagination()
    handleGetListParticipant()
  }, [sort, search])

  const resetPagination = () => {
    pagination.page = 1
    pagination.totalPage = 1
    pagination.totalData = 0
    setPagination(pagination)
  }

  const handleGetListParticipant = () => {
    getParticipantSearch(`order=${sort.by},${sort.type}&limit=${pagination.limit}&page=${pagination.page}`)(search)
      .then((res) => {
        const data = res.data.data
        if (pagination.page == 1) {
          setParticipants(data.participants);
        } else {
          setParticipants([...participants, ...data.participants]);
        }

        setPagination({ ...pagination, totalPage: data.total_page, totalData: data.total_item })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleInviteButton = (participant) => {
    setSelectedParticipant(participant.id)
    onOpen()
  }

  const handleClosePopup = () => {
    setSelectedParticipant(null)
    onClose()
  }

  return (
    <DashboardSearchParticipant
      pageTitle='Search Participant'
      sort={sort}
      setSort={setSort}
      search={search}
      setSearch={setSearch}
    >
      <PopupConfirmation
        header='Invite Participant'
        body={PopupConfirmationBody({
          onClose: handleClosePopup,
          eventId: latestEvent?.id,
          teamId: myTeam?.id,
          participantId: selectedParticipant
        })}
        isForm
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
      <Grid
        flexDirection='column'
        gap={7}
        h='fit'
        maxHeight='786px'
        overflow='auto'
        pr='40px'
      >
        {participants.length == 0 &&         
          <Center mt='130px'>
            <VStack>
              <HStack mb={2}>
                <Bs4SquareFill fontSize='50px' />
                <Bs0Square fontSize='50px' />
                <Bs4SquareFill fontSize='50px' />
              </HStack>
              <Heading as='h3' fontSize='xl'>No Data Found</Heading>
            </VStack>
          </Center>
        }
        {participants.map((item) => (
          <React.Fragment key={item.id}>
            <PreviewProfileCard inviteAction inviteOnClick={() => handleInviteButton(item)} data={item} />
          </React.Fragment>
        ))}
        {pagination.page < pagination.totalPage && (
          <Button
            isLoading={isLoading}
            onClick={() => {
              setIsLoading(true)
              pagination.page += 1
              setPagination(pagination)
              handleGetListParticipant()
              setIsLoading(false)
            }}
            colorScheme='red'
          >
            Load more participants
          </Button>
        )}
      </Grid>
    </DashboardSearchParticipant>
  )
}

function PopupConfirmationBody({onClose, eventId, teamId, participantId}) {
  const toast = useFormToast('invitation-form')

  const initialValues = {
    note: ''
  }

  const handleSubmit = (value) => {
    toast.close()
    const payload = {
      ...value,
      event_id: eventId,
      team_id: teamId,
      to_participant_id: participantId
    }
    postInvitation(payload)
      .then((res) => {
        console.log('res: ', res);
        toast.send(
          'success',
          'Invitation Sent!',
          'Sucessfully invite participant to join your team.'
        )
      })
      .catch((err) => {
        let title = 'Form Error!'
        let message = err.message

        if (err.response?.status === 400) {
          title = 'Request Failed!'
          message = err.response?.data.error[0]
        }

        toast.send('error', title, message)
      })
      .finally(() => {
        onClose()
      })
  }

  const validationSchema = Yup.object().shape({
    note: Yup.string().required('Required')
  })

  return (
    <Box pb={8}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {({submitForm, errors, touched, isSubmitting}) => (
          <Form>
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