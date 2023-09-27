import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  SimpleGrid,
  Box,
  Image,
  Input,
  Textarea,
  Select,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  VStack,
  useDisclosure,
  HStack
} from '@chakra-ui/react'

import FileUploader from 'components/molecules/FileUploader'

import DashboardSettingLayout from 'layouts/DashboardSettingLayout'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useFormToast } from 'hooks/form-toast'

import { useFileUploader } from 'hooks/upload'
import { useParticipantProfile } from 'hooks/swr/users'
import { putParticipantPreference, putParticipantProfile } from 'services/users'

import { siteTitle } from 'config'
import DatePickerFormik from 'components/atoms/DatePicker/index'
import AsyncSelectFormik from 'components/atoms/Select/AsyncSelectFormik'
import { toISOStringWithTimezone } from 'libs/dateFormatter'
import { useRouter } from 'node_modules/next/router'
import { setUser } from 'libs/local-storage/user'
import { createOccupation, createSpeciality, getOccupations, getSkills, getSpecialities } from 'services/master-data'
import AsyncCreatableSelectFormik from 'components/atoms/Select/AsyncCreatableSelectFormik'

const initialValues = {
  occupation_id: 0,
  company_name: '',
  num_of_hackathon: 0,
  portfolio: '',
  repository: '',
  linkedin: '',
  resume: '',
  speciality_id: 0,
  skills: [],
}

const validationSchema = Yup.object().shape({
  occupation_id: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Required'),
  company_name: Yup.string(),
  num_of_hackathon: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Required'),
  portfolio: Yup.string(),
  repository: Yup.string(),
  linkedin: Yup.string(),
  speciality_id: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Required'),
  skills: Yup.array()
    .min(1, 'Required')
    .required('Required'),
})

DashboardSettingPreference.getLayout = (page) => {
  return <DashboardSettingLayout>{page}</DashboardSettingLayout>
}

export default function DashboardSettingPreference() {
  const toast = useFormToast('preference-panel')
  const router = useRouter()

  const selectOccupationRef = useRef();
  const [occupations, setOccupations] = useState([])
  const [filteredOccupations, setFilteredOccupations] = useState([])
  const [createdOccupations, setCreatedOccupations] = useState([])
  const [isLoadingOccupations, setLoadingOccupations] = useState(true)

  const selectSpecialityRef = useRef();
  const [specialities, setSpecialities] = useState([])
  const [filteredSpecialities, setFilteredSpecialities] = useState([])
  const [createdSpecialities, setCreatedSpecialities] = useState([])
  const [isLoadingSpecialities, setLoadingSpecialities] = useState(true)

  const [skills, setSkills] = useState([])
  const [filteredSkills, setFilteredSkills] = useState([])
  const [isLoadingSkills, setLoadingSkills] = useState(true)

  useEffect(() => {
    handleGetOccupations({ firstLoad: true })
    handleGetSpecialities({ firstLoad: true })
    handleGetSkills({ firstLoad: true })
  }, [])

  const {
    data: participant,
    isLoadingData,
    error,
    mutate
  } = useParticipantProfile()

  const [formInitialValues, setFormInitialValue] = useState(initialValues)

  useEffect(() => {
    if (!isLoadingData && !error && participant !== undefined) {
      handleInitData(participant)
    }
  }, [error, isLoadingData, participant])

  const handleInitData = (participant) => {
    if (participant.user.occupation_id != null &&
      participant.user.occupation_id > 0 &&
      !occupations.find(occupation => occupation.value === participant.user.occupation_id)
    ) {
      setOccupations([...occupations, { value: participant.user.occupation_id, label: participant.user.occupation.name }])
    }

    if (participant.speciality_id != null &&
      participant.speciality_id > 0 &&
      !specialities.find(speciality => speciality.value === participant.speciality_id)
    ) {
      setSpecialities([...specialities, { value: participant.speciality_id, label: participant.speciality.name }])
    }

    const initVal = {
      occupation_id: participant.user.occupation_id,
      company_name: participant.user.institution ?? '',
      num_of_hackathon: participant.num_of_hackathon,
      portfolio: participant.link_portfolio ?? '',
      repository: participant.link_repository ?? '',
      linkedin: participant.link_linkedin ?? '',
      resume: participant.resume ?? '',
      speciality_id: participant.speciality_id,
      skills: []
    }
    if (participant.skills !== null && participant.skills.length > 0) {
      let setNewSkills = []
      participant.skills.forEach(element => {
        if (!skills.find(skill => skill.value === element.skill_id)) {
          setNewSkills.push({ value: element.skill_id, label: element.skill.name })
        }

        initVal.skills.push(element.skill_id)
      });

      setSkills([...skills, ...setNewSkills])
    }

    setFormInitialValue(initVal)
  }

  const handleGetOccupations = ({ firstLoad = false, name = '' }) => {
    setLoadingOccupations(true)
    getOccupations({ order: 'id,asc', limit: 100, page: 1, status: 'active', name })
      .then((res) => {
        if (res && res.status === 200) {
          const data = res.data.data.occupations
          const newOccupations = []
          if (data != null && data != undefined) {
            data.forEach(occupation => {
              newOccupations.push({ value: occupation.id, label: occupation.name })
            });
          }

          if (firstLoad) {
            setOccupations([...newOccupations, ...createdOccupations])
          } else {
            setFilteredOccupations([...newOccupations, ...createdOccupations])
          }
        }
        setLoadingOccupations(false)
      })
  }

  const handleCreateOccupation = async (inputValue) => {
    setLoadingOccupations(true)
    const resCreate = await createOccupation({ name: inputValue })
    if (!resCreate || resCreate.status !== 201) {
      setLoadingOccupations(false)
      return null
    }

    const resGet = await getOccupations({ order: 'id,desc', limit: 1, page: 1, status: 'active', name: inputValue })
    if (!resGet || resGet.status !== 200) {
      setLoadingOccupations(false)
      return null
    }

    const data = resGet.data.data.occupations
    if (data == null || data == undefined) {
      setLoadingOccupations(false)
      return null

    }

    const newOccupation = { value: data[0].id, label: data[0].name }
    setCreatedOccupations([...createdOccupations, newOccupation])
    setOccupations((prev) => [...prev, newOccupation])
    setFilteredOccupations((prev) => [...prev, newOccupation])
    setLoadingOccupations(false)
    return newOccupation
  }

  const handleGetSpecialities = ({ firstLoad = false, name = '' }) => {
    setLoadingSpecialities(true)
    getSpecialities({ order: 'id,asc', limit: 100, page: 1, status: 'active', name })
      .then((res) => {
        if (res && res.status === 200) {
          const data = res.data.data.specialities
          const newSpecialities = []
          if (data != null && data != undefined) {
            data.forEach(speciality => {
              newSpecialities.push({ value: speciality.id, label: speciality.name })
            });
          }

          if (firstLoad) {
            setSpecialities([...newSpecialities, ...createdSpecialities])
          } else {
            setFilteredSpecialities([...newSpecialities, ...createdSpecialities])
          }
        }
        setLoadingSpecialities(false)
      })
  }

  const handleCreateSpeciality = async (inputValue) => {
    setLoadingSpecialities(true)
    const resCreate = await createSpeciality({ name: inputValue })
    if (!resCreate || resCreate.status !== 201) {
      setLoadingSpecialities(false)
      return null
    }

    const resGet = await getSpecialities({ order: 'id,desc', limit: 1, page: 1, status: 'active', name: inputValue })
    if (!resGet || resGet.status !== 200) {
      setLoadingSpecialities(false)
      return null
    }

    const data = resGet.data.data.specialities
    if (data == null || data == undefined) {
      setLoadingSpecialities(false)
      return null

    }

    const newSpeciality = { value: data[0].id, label: data[0].name }
    setCreatedSpecialities([...createdSpecialities, newSpeciality])
    setSpecialities((prev) => [...prev, newSpeciality])
    setFilteredSpecialities((prev) => [...prev, newSpeciality])
    setLoadingSpecialities(false)
    return newSpeciality
  }

  const handleGetSkills = ({ firstLoad = false, name = '' }) => {
    setLoadingSkills(true)
    getSkills({ order: 'id,asc', limit: 100, page: 1, status: 'active', name })
      .then((res) => {
        if (res && res.status === 200) {
          const data = res.data.data.skills
          const newSkills = []
          if (data != null && data != undefined) {
            data.forEach(skill => {
              newSkills.push({ value: skill.id, label: skill.name })
            });
          }

          if (firstLoad) {
            setSkills(newSkills)
          } else {
            setFilteredSkills(newSkills)
          }
        }
        setLoadingSkills(false)
      })
  }

  const resumeUploader = useFileUploader({
    path: 'cv',
    validate: (files) => files[0].size > 2000000 ? ['maximum file size is 2MB'] : null,
    // previousFile: participantProfile?.resume
  })

  const isResumeUploadSuccess = resumeUploader.data && !resumeUploader.isLoading && !resumeUploader.error

  const handleSubmit = async (values, { resetForm }) => {
    toast.close()

    // do nothing while waiting for avatar or CV upload
    if (resumeUploader.isLoading) {
      toast.send(
        'info',
        'Uploading File',
        'Please wait until avatar and resume upload finished'
      )
      return
    }

    // prevent submitting if avatar or CV upload is error
    if (resumeUploader.error) {
      toast.send(
        'info',
        'File Upload Failed',
        'Please make sure avatar and resume upload succeeded, otherwise try reuploading the file and try again'
      )
      return
    }

    try {
      const payload = JSON.parse(JSON.stringify(values));
      payload.company_name = values.company_name === '' ? null : values.company_name
      payload.portfolio = values.portfolio === '' ? null : values.portfolio
      payload.repository = values.repository === '' ? null : values.repository
      payload.linkedin = values.linkedin === '' ? null : values.linkedin
      payload.resume = resumeUploader.data?.file_url ?? null

      let newSkills = []
      payload.skills.forEach(skill_id => {
        if (participant.skills !== null && !participant.skills.find(skill => skill.skill_id === skill_id)) {
          newSkills.push(skill_id)
        }
      });

      let removedSkills = []
      participant.skills.forEach(skill => {
        if (payload.skills !== null && !payload.skills.find(pskill => pskill === skill.skill_id)) {
          removedSkills.push(skill.skill_id)
        }
      });

      payload.skills = newSkills
      payload.removed_skills = removedSkills

      const res = await putParticipantPreference(payload)
      if (res && res.data.code === 200) {
        const data = res.data.data
        setUser(data)

        toast.send(
          'success',
          'Changes Saved!',
          'Sucessfully update preference.'
        )

        mutate()
        resetForm()
        resumeUploader.reset()
        setTimeout(() => router.push('/dashboard/payment'), 3000)
      }
    } catch (err) {
      let title = 'Form Error!'
      let message = err.message

      if (err.response?.status === 400) {
        title = 'Saving Failed!'
        message = 'Please make sure your input is valid and try again...'
      }

      toast.send('error', title, message)
    }
  }

  return (
    <>
      <Head>
        <title>Experience & Preference Setting | {siteTitle}</title>
      </Head>

      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, values }) => (
          <Form>
            <VStack spacing={6} p={8} mb={8} bg='gray.700' borderRadius='lg'>
              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.occupation_id && errors.occupation_id}
                  >
                    <FormLabel htmlFor='occupation_id'>Occupation</FormLabel>
                    <Field
                      component={AsyncCreatableSelectFormik}
                      id='occupation_id'
                      name='occupation_id'
                      type='number'
                      placeholder="Select an occupation"
                      innerRef={selectOccupationRef}
                      isLoading={isLoadingOccupations}
                      defaultOptions={occupations}
                      loadOptions={(inputValue, callback) => {
                        handleGetOccupations({ name: inputValue })
                        callback(filteredOccupations)
                      }}
                      onCreate={handleCreateOccupation}
                    />

                    <FormErrorMessage>{errors.occupation_id}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w='100%'>
                  <FormControl isInvalid={touched.company_name && errors.company_name}>
                    <FormLabel htmlFor='company_name'>Company Name</FormLabel>
                    <Field
                      as={Input}
                      variant='white'
                      id='company_name'
                      name='company_name'
                      type='text'
                      placeholder='Enter your company name here...'
                    />
                    <FormErrorMessage>{errors.company_name}</FormErrorMessage>
                  </FormControl>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl isInvalid={touched.num_of_hackathon && errors.num_of_hackathon}>
                    <FormLabel htmlFor='num_of_hackathon'>How many hackathons have you attended?</FormLabel>
                    <Field
                      as={Input}
                      variant='white'
                      id='num_of_hackathon'
                      name='num_of_hackathon'
                      type='number'
                    />
                    <FormErrorMessage>{errors.num_of_hackathon}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w='100%'>
                  <FormControl isInvalid={touched.portfolio && errors.portfolio}>
                    <FormLabel htmlFor='portfolio'>Portfolio</FormLabel>
                    <Field
                      as={Input}
                      variant='white'
                      id='portfolio'
                      name='portfolio'
                      type='text'
                      placeholder='https://www.myportfolio.com'
                    />
                    <FormErrorMessage>{errors.portfolio}</FormErrorMessage>
                  </FormControl>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl isInvalid={touched.repository && errors.repository}>
                    <FormLabel htmlFor='repository'>Repository</FormLabel>
                    <Field
                      as={Input}
                      variant='white'
                      id='repository'
                      name='repository'
                      type='text'
                      placeholder='https://www.github.com/username'
                    />
                    <FormErrorMessage>{errors.repository}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w='100%'>
                  <FormControl isInvalid={touched.linkedin && errors.linkedin}>
                    <FormLabel htmlFor='linkedin'>Linkedin</FormLabel>
                    <Field
                      as={Input}
                      variant='white'
                      id='linkedin'
                      name='linkedin'
                      type='text'
                      placeholder='https://www.linkedin.com/in/username'
                    />
                    <FormErrorMessage>{errors.linkedin}</FormErrorMessage>
                  </FormControl>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FileUploader
                    label='Upload Resume/CV'
                    accept='.pdf'
                    isLoading={resumeUploader.isLoading}
                    isSuccess={isResumeUploadSuccess}
                    error={resumeUploader.error?.message}
                    {...resumeUploader.inputFileProps}
                    currentFile={
                      participant?.resume && {
                        url: participant.resume,
                        name: participant.resume.split('/').slice(-1)[0]
                      }
                    }
                  />
                </Box>

                <Box w='100%'>
                  <VStack spacing={6} pt={3}>
                    <FormControl
                      isRequired
                      isInvalid={touched.speciality_id && errors.speciality_id}
                    >
                      <FormLabel htmlFor='speciality_id'>What is your speciality?</FormLabel>
                      <Field
                        component={AsyncCreatableSelectFormik}
                        id='speciality_id'
                        name='speciality_id'
                        type='number'
                        placeholder="Select a speciality"
                        innerRef={selectSpecialityRef}
                        isLoading={isLoadingSpecialities}
                        defaultOptions={specialities}
                        loadOptions={(inputValue, callback) => {
                          handleGetSpecialities({ name: inputValue })
                          callback(filteredSpecialities)
                        }}
                        onCreate={handleCreateSpeciality}
                      />

                      <FormErrorMessage>{errors.speciality_id}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                      isInvalid={touched.skills && errors.skills}
                    >
                      <FormLabel htmlFor='skills'>What are your skills?</FormLabel>
                      <Field
                        component={AsyncSelectFormik}
                        id='skills'
                        name='skills'
                        placeholder="Select skills"
                        isMulti
                        isLoading={isLoadingSkills}
                        defaultOptions={skills}
                        loadOptions={(inputValue, callback) => {
                          handleGetSkills({ name: inputValue })
                          callback(filteredSkills)
                        }}
                        onValueChange={(value, setFieldValue, option) => {
                          if (option !== null && option !== undefined) {
                            let setNewSkills = []
                            option.forEach(element => {
                              if (!skills.find(skill => skill.value === element.value)) {
                                setNewSkills.push({ value: element.value, label: element.label })
                              }
                            });

                            setSkills([...skills, ...setNewSkills])
                          }
                        }}
                      />

                      <FormErrorMessage>{errors.skills}</FormErrorMessage>
                    </FormControl>
                  </VStack>
                </Box>
              </SimpleGrid>
            </VStack>

            <SimpleGrid columns={1} w='100%'>
              <Box w='30%'>
                <Button
                  colorScheme='red'
                  isLoading={isSubmitting}
                  isDisabled={
                    isSubmitting ||
                    resumeUploader.isLoading
                  }
                  w='full'
                  type='submit'
                >
                  Save
                </Button>
              </Box>
            </SimpleGrid>
          </Form>
        )}
      </Formik>
    </>
  )
}
