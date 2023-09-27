import {
  Heading,
  Box,
  useDisclosure,
  Flex,
  Grid,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Image,
  AspectRatio
} from '@chakra-ui/react'

import PreviewProfileCard from 'components/organisms/PreviewProfileCard/index'
import Card from 'components/atoms/Card'
import PopupConfirmation from 'components/molecules/PopupConfirmation'

import { Field, Form, Formik } from 'formik'

import DashboardMainLayout from 'layouts/DashboardMainLayout'

import { postCreateTeam, putEditTeam } from 'services/teams'
import { postUpload } from 'services/general'

import { getLatestEvent } from 'libs/local-storage/event'

import { useEffect, useState, useRef, Fragment } from 'react'

import { useRouter } from 'next/router'

import { useMyTeam, useMyMember } from 'hooks/swr/teams'
import { useFormToast } from 'hooks/form-toast'

CreateTeam.getLayout = (page) => {
  return (
    <DashboardMainLayout pageTitle='Create Team'>{page}</DashboardMainLayout>
  )
}

const initValues = {
  name: '',
  description: ''
}

export default function CreateTeam() {
  const router = useRouter()
  const toast = useFormToast('create-edit-team')

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: myTeam } = useMyTeam()
  const { data: members } = useMyMember(myTeam?.id)

  const uploadRef = useRef(null)

  const [eventId, setEventId] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [showSection, setShowSection] = useState(false);

  const [initialValues, setInitialValues] = useState(initValues)

  const handleInitData = (team) => {
    const initial = {
      name: team.name,
      description: team.description
    }
    setAvatar(team.avatar)

    setInitialValues(initial)
  }

  useEffect(() => {
    getLatestEvent()
      .then((res) => {
        setEventId(res.event_info.id)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    if (myTeam) {
      handleInitData(myTeam)
    }
  }, [myTeam])

  const formSubmit = (values) => {
    const payload = { ...values, event_id: eventId, avatar }
    if (myTeam) {
      putEditTeam(myTeam.id, payload)
        .then(() => {
          toast.send(
            'success',
            'Edit Team Successfull!',
            'Sucessfully edit team.'
          )
        })
        .catch((err) => {
          let title = 'Form Error!'
          let message = err.message

          toast.send('error', title, message)
        })
    } else {
      postCreateTeam(payload)
        .then(() => {
          toast.send(
            'success',
            'Create Team Successfull!',
            'Sucessfully create team.'
          )
          setIsSaved(true)
          setShowSection(true)
        })
        .catch((err) => {
          let title = 'Form Error!'
          let message = err.message

          toast.send('error', title, message)
        })
    }
  }

  const holderClick = () => {
    uploadRef.current.click()
  }

  const imageHandler = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 1000000) {
        toast({
          title: 'Failed upload thumbnail',
          description: 'File cannot larger than 2Mb'
        })
      } else {
        const formData = new FormData()
        formData.append('file', file, file.name)
        formData.append('path', 'project/images')
        formData.append('overwrite', false)
        postUpload(formData)
          .then((res) => {
            setAvatar(res.data.data.file_url)
            toast({ title: res.data.message, status: 'success' })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }

  return (
    <>
      <Card
        variant='solid'
        layerStyle='dashboardCard'
        w='full'
        py={8}
        px='30px'
      >
        <Formik
          initialValues={initialValues}
          onSubmit={formSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmiting }) => (
            <>
              <Box>
                <Heading
                  as='h1'
                  fontSize='3xl'
                  mb={8}
                >
                  {myTeam ? 'Edit Team' : 'Create Team'}
                </Heading>
              </Box>
              <Form>
                <input
                  type='file'
                  hidden
                  ref={uploadRef}
                  onChange={imageHandler}
                  accept='image/*'
                />
                <Flex gap='46px'>
                  <Box w='18%'>
                    <AspectRatio ratio={1}>
                      <Image
                        src={avatar}
                        fallbackSrc='/images/avatar-fallback.png'
                        alt='avatar'
                        onClick={holderClick}
                        borderRadius='full'
                        style={{ cursor: 'pointer' }}
                      />
                    </AspectRatio>
                  </Box>
                  <Box flexGrow='1'>
                    <FormControl
                      isRequired
                      marginBottom='18px'
                    >
                      <FormLabel htmlFor='name'>Name</FormLabel>
                      <Field
                        as={Input}
                        variant='white'
                        id='name'
                        name='name'
                        type='text'
                        placeholder='Enter your project name here...'
                      />
                      <FormErrorMessage>{errors.name && touched.name}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      marginBottom='18px'
                    >
                      <FormLabel htmlFor='description'>Description</FormLabel>
                      <Field
                        as={Textarea}
                        variant='white'
                        id='description'
                        name='description'
                        type='text'
                        placeholder='Enter your project name here...'
                      />
                      <FormErrorMessage>{errors.description && touched.description}</FormErrorMessage>
                    </FormControl>
                    <Button
                      variant='solid'
                      size='lg'
                      colorScheme='red'
                      fontSize='base'
                      type='submit'
                      disabled={isSubmiting}
                    >
                      Save
                    </Button>
                  </Box>
                </Flex>
              </Form>
            </>
          )}
        </Formik>
      </Card>

      {
        showSection && (
          isSaved && (
            <Card
              variant='solid'
              layerStyle='dashboardCard'
              w='full'
              pb={5}
              px='30px'
              mt={10}
            >
              <Box>
                <Heading
                  as='h1'
                  fontSize='3xl'
                  mb='21px'
                  mt='26px'
                >
                  Members
                </Heading>
              </Box>
              <Button
                as='a'
                variant='solid'
                size='lg'
                colorScheme='red'
                fontSize='base'
                mb={5}
                onClick={() => router.push('/dashboard/search-participant')}
              >
                Add Member
              </Button>
              <Grid
                flexDirection='column'
                gap={7}
                h='fit'
                maxHeight='474px'
                overflow='auto'
                pr='40px'
              >
                {members?.map((member) => (
                  <Fragment key={member.id}>
                    <PreviewProfileCard data={member} />
                  </Fragment>
                ))}
              </Grid>
            </Card>
          )
        )
      }

      <PopupConfirmation
        header='Team A'
        body='Once you join the team, you can’t choose or move into another team'
        button='Join Team'
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </>
  )
}
