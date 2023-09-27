import {
  Heading,
  Box,
  useDisclosure,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Flex,
  Image,
  Spacer,
  AspectRatio,
} from '@chakra-ui/react'
import { MdClose } from 'react-icons/md'
import FileUploader from 'components/molecules/FileUploader/index'

import dynamic from 'next/dynamic'

import { Field, Form, Formik, FieldArray } from 'formik'

import PopupConfirmation from 'components/molecules/PopupConfirmation'
import AsyncSelectFormik from 'components/atoms/Select/AsyncSelectFormik'

import DashboardMainLayout from 'layouts/DashboardMainLayout'

import { getTechnologies } from 'services/references'
import { createProject, editProject } from 'services/project'
import { postUpload } from 'services/general'

import { useMyTeam } from 'hooks/swr/teams'
import { useProject } from 'hooks/swr/project'
import { useFileUploader } from 'hooks/upload'

import { getLatestEvent } from 'libs/local-storage/event'

import { useEffect, useRef, useState } from 'react'
import { useLatestEvents } from 'hooks/swr/events'
import { useFormToast } from 'hooks/form-toast'
import { useRouter } from 'node_modules/next/router'
import { useParticipantProfile } from 'hooks/swr/users'

const ReactQuill = dynamic(import('react-quill'), { ssr: false })

CreateProject.getLayout = (page) => {
  return (
    <DashboardMainLayout pageTitle='Create Project'>{page}</DashboardMainLayout>
  )
}

export default function CreateProject() {
  const router = useRouter()
  const toast = useFormToast('create-edit-project')
  const thumbnailRef = useRef(null)
  const [initialValues, setInitialValues] = useState({
    name: '',
    elevator_pitch: '',
    story: '',
    built_with: [],
    site_links: [''],
    removed_site_links: [],
    video: ''
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: team } = useMyTeam()
  const { data: latestEvent } = useLatestEvents()
  const { data: participant } = useParticipantProfile()
  const { data: projectDetail } = useProject(team?.project_id)

  const [history, setHistory] = useState('')

  const [technologies, setTechnologies] = useState([])
  const [filteredTechnology, setFilteredTechnology] = useState([])
  const [isLoadingTechnologies, setLoadingTechnologies] = useState(true)

  const [status, setStatus] = useState('')
  const [images, setImages] = useState([])
  const [thumbnail, setThumbnail] = useState('')

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' }
      ]
    ]
  }

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent'
  ]

  const handleGetTechnologies = ({ firstLoad = false, name = '' }) => {
    setLoadingTechnologies(true)
    getTechnologies({
      order: 'id,asc',
      limit: 100,
      page: 1,
      status: 'active',
      name
    }).then((res) => {
      if (res && res.status === 200) {
        const data = res.data.data.technologies
        const newTechnologies = []
        if (data !== null && data !== undefined) {
          data.forEach((skill) => {
            newTechnologies.push({ value: skill.id, label: skill.name })
          })
        }

        if (firstLoad) {
          setTechnologies(newTechnologies)
        } else {
          setFilteredTechnology(newTechnologies)
        }
      }
      setLoadingTechnologies(false)
    })
  }

  useEffect(() => {
    if (projectDetail) {
      handleInitData(projectDetail)
    }
  }, [projectDetail])

  const handleInitData = (project) => {
    setThumbnail(project.thumbnail)
    setHistory(project.story)
    const initVal = {
      name: project.name,
      elevator_pitch: project.elevator_pitch,
      story: project.story,
      built_with: [],
      curr_site_links: project.site_links,
      removed_site_links: [],
      video: project.video
    }

    // handle link
    if (project.site_links.length > 0) {
      const newLink = []
      project.site_links.map((item) => newLink.push(item.link))
      initVal.site_links = newLink
    }

    // handle project
    if (project.built_with.length > 0) {
      const newTech = []
      project.built_with?.forEach((element) => {
        if (
          !technologies.find((tech) => tech.value === element.technology_id)
        ) {
          newTech.push({
            value: element.technology_id,
            label: element.technology.Name
          })
        }
        initVal.built_with.push(element.technology_id)
      })
      setTechnologies([...technologies, ...newTech])
    }

    // handle image
    if (project.images.length > 0) {
      const newImages = [...images]
      project.images.map((item) => {
        if (!images.find((img) => img === item.image)) {
          newImages.push(item.image)
        }
        return false
      })
      setImages(newImages)
    }
    setInitialValues(initVal)
  }

  useEffect(() => {
    handleGetTechnologies({ firstLoad: true })
  }, [])

  const imageUpload = useFileUploader({
    path: 'project/images',
    validate: (files) =>
      files[0].size > 1000000 ? ['maximum file size is 2MB'] : null
  })

  const customUpload = (e) => {
    if (participant.id !== team.participant_id) {
      toast.send(
        'error',
        'Forbidden!',
        "You don't have permission"
      )
      return
    }

    if (projectDetail && projectDetail?.status === 'submitted') {
      toast.send(
        'error',
        'Forbidden!',
        "Your team project has been submitted"
      )
      return
    }

    const files = e.target.files.length > 0 ? Array.from(e.target.files) : null
    const newImage = [...images]
    files.map((item) =>
      imageUpload.inputFileProps
        .onChange({ target: { files: [item] } })
        .then((res) => {
          newImage.push(res?.file_url)
        })
        .catch((err) => {
          console.log(err)
        })
    )
    setImages(newImage)
  }

  const handleThumbnail = (e) => {
    if (participant.id !== team.participant_id) {
      toast.send(
        'error',
        'Forbidden!',
        "You don't have permission"
      )
      return
    }

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
        formData.append('path', 'project/thumbnail')
        formData.append('overwrite', false)
        postUpload(formData)
          .then((res) => {
            setThumbnail(res.data.data.file_url)
            toast({ title: res.data.message, status: 'success' })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }

  const formSubmit = (values) => {
    toast.close()
    const payload = {
      ...values,
      status,
      event_id: latestEvent?.id,
      images,
      thumbnail,
      team_id: team?.id,
      story: history
    }

    if (projectDetail) {
      let newBuiltWith = []
      payload.built_with.forEach(techId => {
        if (projectDetail.built_with !== null && !projectDetail.built_with.find(tech => tech.technology_id === techId)) {
          newBuiltWith.push(techId)
        }
      });

      let removedBuiltWith = []
      projectDetail.built_with.forEach(tech => {
        if (payload.built_with !== null && !payload.built_with.find(techId => techId === tech.technology_id)) {
          removedBuiltWith.push(tech.technology_id)
        }
      });

      payload.built_with = newBuiltWith
      payload.removed_built_with = removedBuiltWith

      let newSiteLinks = []
      payload.site_links.forEach(link => {
        if (payload.curr_site_links !== null && !payload.curr_site_links.find(siteLink => siteLink.link === link)) {
          newSiteLinks.push(link)
        }
      });
      payload.site_links = newSiteLinks

      //TODO: process new images & removed images
      payload.images = []

      editProject(projectDetail.id, payload)
        .then((res) => {
          toast.send(
            'success',
            'Update Project Successfull!',
            'Sucessfully update project.'
          )
        })
        .catch((err) => {
          let title = 'Form Error!'
          let message = err.message

          toast.send('error', title, message)
        })
      
      setTimeout(() => router.push('/dashboard/teams'), 500);
      return
    }

    createProject(payload)
      .then((res) => {
        toast.send(
          'success',
          'Create Project Successfull!',
          'Sucessfully create project.'
        )
      })
      .catch((err) => {
        let title = 'Form Error!'
        let message = err.message

        toast.send('error', title, message)
      })

    setTimeout(() => router.push('/dashboard/teams'), 500);
  }

  return (
    <>
      <Heading as='h1' fontSize='3xl' mb={8}>{projectDetail ? 'Edit Project' : 'Create Project'}</Heading>
      <Formik
        initialValues={initialValues}
        onSubmit={formSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmiting, values }) => (
          <Form>
            {/* General Information : */}
            <Box borderTop='1px solid white' pt='18px' mb={8}>
              <Heading as='h1' fontSize='xl' mb={8}>General Info</Heading>
              <Grid templateColumns='repeat(5, 1fr)' gap='55px'>
                <GridItem colSpan={3}>
                  <Flex flexDirection='column' h='full'>
                    <Box h='fit'>
                      <FormControl
                        isRequired
                        marginBottom='18px'
                      >
                        <FormLabel htmlFor='name'>Project Name</FormLabel>
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
                    </Box>
                    <Box flexGrow='1'>
                      <FormControl
                        isRequired
                        h='100%'
                      >
                        <Flex flexDirection='column' h='100%'>
                          <FormLabel htmlFor='elevator_pitch'>Elevator Pitch</FormLabel>
                          <Field
                            h='100%'
                            as={Textarea}
                            variant='white'
                            id='elevator_pitch'
                            name='elevator_pitch'
                            type='text'
                            placeholder='Enter your elevator pitch here...'
                          />
                        </Flex>
                        <FormErrorMessage>{errors.elevator_pitch && touched.elevator_pitch}</FormErrorMessage>
                      </FormControl>
                    </Box>
                  </Flex>
                </GridItem>
                <GridItem colSpan={2}>
                  <AspectRatio ratio={1}>
                    <Image
                      src={thumbnail}
                      fallbackSrc='/images/avatar-fallback.png'
                      alt='thumbnail'
                    />
                  </AspectRatio>
                  <input
                    type='file'
                    hidden
                    ref={thumbnailRef}
                    onChange={handleThumbnail}
                    accept='image/*'
                  />

                  {(!projectDetail || (projectDetail && projectDetail?.status === 'draft')) &&
                    <Button
                      as='a'
                      variant='solid'
                      size='lg'
                      colorScheme='red'
                      w='full'
                      fontSize='base'
                      mt='17px'
                      onClick={() => thumbnailRef.current?.click()}
                    >
                      Edit Thumbnail
                    </Button>
                  }
                </GridItem>
              </Grid>
            </Box>

            {/* Project Details : */}
            <Box borderTop='1px solid white' pt='18px' mb={8}>
              <Heading as='h1' fontSize='xl' mb={8}>Project Details</Heading>
              <Box>
                <FormControl
                  isRequired
                  marginBottom='18px'
                >
                  <FormLabel htmlFor='story'>Project Story</FormLabel>
                  <ReactQuill
                    theme='snow'
                    value={history}
                    onChange={setHistory}
                    modules={modules}
                    formats={formats}
                  />
                  <FormErrorMessage>{errors.story && touched.story}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box h='fit'>
                <FormControl
                  isRequired
                  marginBottom='18px'
                >
                  <FormLabel htmlFor='built_with'>Built With</FormLabel>
                  <Field
                    component={AsyncSelectFormik}
                    id='built_with'
                    name='built_with'
                    placeholder='Select technologies'
                    isMulti
                    isLoading={isLoadingTechnologies}
                    defaultOptions={technologies}
                    loadOptions={(inputValue, callback) => {
                      handleGetTechnologies({ name: inputValue })
                      callback(filteredTechnology)
                    }}
                    onValueChange={(value, setFieldValue, option) => {
                      if (option !== null && option !== undefined) {
                        const setNewTechnologies = []
                        option.forEach((element) => {
                          if (
                            !technologies.find(
                              (skill) => skill.value === element.value
                            )
                          ) {
                            setNewTechnologies.push({
                              value: element.value,
                              label: element.label
                            })
                          }
                        })

                        setTechnologies([
                          ...technologies,
                          ...setNewTechnologies
                        ])
                      }
                    }}
                  />
                  <FormErrorMessage>{errors.built_with && touched.built_with}</FormErrorMessage>
                </FormControl>
              </Box>
              <FieldArray
                name='site_links'
                render={(arrayHelper) => (
                  <Box h='fit'>
                    {values.site_links?.map((_, i) => (
                      <FormControl
                        isRequired
                        marginBottom='18px'
                        key={i}
                      >
                        <Flex>
                          <FormLabel htmlFor='site_links'>
                            Site Links {values.site_links.length > 1 && i + 1}
                          </FormLabel>
                          <Spacer />

                          {i > 0 &&
                            <Button
                              variant='link'
                              w='24px'
                              h='24px'
                              borderRadius='100%'
                              justifyContent='center'
                              alignItems='center'
                              cursor='pointer'
                              onClick={() => {
                                arrayHelper.remove(i)
                                if (projectDetail) {
                                  values.removed_site_links.push(values.curr_site_links[i].id)
                                }
                              }}
                            >
                              <MdClose fontSize='20px' />
                            </Button>
                          }
                        </Flex>
                        <Field
                          as={Input}
                          variant='white'
                          id={`site_links.${i}`}
                          name={`site_links.${i}`}
                          type='text'
                          placeholder='URL for demo website, app store listing, etc.'
                        />
                        <FormErrorMessage>{errors.site_links && touched.site_links}</FormErrorMessage>
                      </FormControl>
                    ))}
                    <Button
                      p={0}
                      variant='link'
                      onClick={() => arrayHelper.insert(values.site_links.length + 1, [])}
                    >
                      ADD ANOTHER LINK
                    </Button>
                  </Box>
                )}
              />
            </Box>

            {/* Project Media : */}
            <Box
              borderTop='1px solid white'
              pt='18px'
              mb={8}
            >
              <Heading
                as='h1'
                fontSize='xl'
                mb={8}
              >
                Project Media
              </Heading>
              <Box h='fit'>
                <FormControl
                  isRequired
                  marginBottom='18px'
                >
                  <FormLabel htmlFor='video'>Video Demo Links</FormLabel>
                  <Field
                    as={Input}
                    variant='white'
                    id='video'
                    name='video'
                    type='text'
                  />
                  <FormErrorMessage>{errors.video && touched.video}.</FormErrorMessage>
                </FormControl>
              </Box>
              <Box h='fit'>
                <FormControl
                  isRequired
                  marginBottom='18px'
                >
                  <FormLabel htmlFor='images'>Image Galery</FormLabel>
                  <Field
                    as={FileUploader}
                    variant='white'
                    id='images'
                    name='images'
                    type='text'
                    onChange={customUpload}
                    multiple
                    {...imageUpload.inputFileProps.key}
                  />
                  <FormErrorMessage>{errors.images && touched.images}</FormErrorMessage>
                </FormControl>
              </Box>
              
              <Grid templateColumns='repeat(4, 1fr)' gap={4}>
                {images.map((item) => (
                  <Image key={item} src={item} alt='project-image' size={32} />
                ))}
              </Grid>

              <Flex
                gap='9px'
                mt='44px'
              >
                { (!projectDetail || (projectDetail && projectDetail?.status === 'draft')) && participant?.id === team?.participant_id && 
                  <>
                    <Button
                      variant='solid'
                      size='lg'
                      colorScheme='red'
                      fontSize='base'
                      disabled={isSubmiting}
                      isLoading={isSubmiting && status === 'submitted'}
                      onClick={() => setStatus('submitted')}
                      type='submit'
                    >
                      Submit
                    </Button>
                    <Button
                      variant='solid'
                      size='lg'
                      colorScheme='red'
                      fontSize='base'
                      disabled={isSubmiting}
                      isLoading={isSubmiting && status === 'draft'}
                      onClick={() => setStatus('draft')}
                      type='submit'
                    >
                      Save as draft
                    </Button>
                  </>
                }
                <Button
                  px={8}
                  type='button'
                  variant='solid'
                  size='lg'
                  colorScheme='gray'
                  fontSize='base'
                  disabled={isSubmiting}
                  onClick={() => router.push('/dashboard/teams')}
                >
                  Back
                </Button>
              </Flex>
            </Box>
          </Form>
        )}
      </Formik>

      {/* Popup Seeting */}
      {/* <PopupConfirmation
        header='Team A'
        body='Once you join the team, you can’t choose or move into another team'
        button='Join Team'
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      /> */}
    </>
  )
}
