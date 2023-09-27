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
import { putParticipantProfile } from 'services/users'

import { siteTitle } from 'config'
import DatePickerFormik from 'components/atoms/DatePicker/index'
import AsyncSelectFormik from 'components/atoms/Select/AsyncSelectFormik'
import { getCities, getDistricts, getProvinces, getVillages } from 'services/region'
import { toISOStringWithTimezone } from 'libs/dateFormatter'
import { useRouter } from 'node_modules/next/router'
import { setUser } from 'libs/local-storage/user'

const initialValues = {
  action: 'update',
  name: '',
  phone_number: '',
  avatar: null,
  bio: '',
  birthdate: new Date('1999-01-01'),
  gender: '',
  address: '',
  province_id: null,
  city_id: null,
  district_id: null,
  village_id: null,
}

const editProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name is at least 3 characthers!')
    .required('Required'),
  phone_number: Yup.number('Please enter a valid phone number!')
    .min(8, 'Phone number is at least 8 digits')
    .min(8, 'Phone number is maximum 14 digits')
    .required('Required'),
  bio: Yup.string().nullable(true),
  birthdate: Yup.date()
    .required('Required'),
  gender: Yup.string()
    .oneOf(['male', 'female'], 'Invalid gender')
    .required('Required'),
  address: Yup.string()
    .required('Required'),
  province_id: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Required'),
  city_id: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Required'),
  district_id: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Required'),
  village_id: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Required'),
})

const validateFileSize = (files) =>
  files[0].size > 1000000 ? ['maximum file size is 1MB'] : null

DashboardSettingProfile.getLayout = (page) => {
  return <DashboardSettingLayout>{page}</DashboardSettingLayout>
}

export default function DashboardSettingProfile() {
  const toast = useFormToast('profile-panel')
  const router = useRouter()

  const [provinces, setProvinces] = useState([])
  const [filteredProvinces, setFilteredProvinces] = useState([])
  const [isLoadingProvinces, setLoadingProvinces] = useState(true)

  const selectCityRef = useRef();
  const [cities, setCities] = useState([])
  const [filteredCities, setFilteredCities] = useState([])
  const [isLoadingCities, setLoadingCities] = useState(false)

  const selectDistrictRef = useRef();
  const [districts, setDistricts] = useState([])
  const [filteredDistricts, setFilteredDistricts] = useState([])
  const [isLoadingDistricts, setLoadingDistricts] = useState(false)

  const selectVillageRef = useRef();
  const [villages, setVillages] = useState([])
  const [filteredVillages, setFilteredVillages] = useState([])
  const [isLoadingVillages, setLoadingVillages] = useState(false)

  useEffect(() => {
    handleGetProvinces(true)
  }, [])

  const {
    data: participant,
    isLoadingData,
    error,
    mutate
  } = useParticipantProfile()

  const [formInitialValues, setFormInitialValue] = useState(initialValues)


  const avatarUploader = useFileUploader({
    path: 'avatars/participants',
    validate: validateFileSize,
    previousFile: participant?.avatar
  })
  const {
    isOpen: isAvatarUploadModalOpen,
    onOpen: onAvatarUploadModalOpen,
    onClose: onAvatarUploadModalClose
  } = useDisclosure()
  const isAvatarUploadSuccess = avatarUploader.data && !avatarUploader.isLoading && !avatarUploader.error

  useEffect(() => {
    if (!isLoadingData && !error && participant !== undefined) {
      handleInitData(participant)
    }
  }, [error, isLoadingData, participant])

  const handleInitData = (participant) => {
    if (participant.province_id != null &&
      participant.province_id > 0 &&
      !provinces.find(province => province.value === participant.province_id)
    ) {
      setProvinces([...provinces, { value: participant.province_id, label: participant.province.name }])
    }

    if (participant.province_id != null && participant.province_id > 0) {
      handleGetCities({ firstLoad: true, province: participant.province_id.toString() })
      if (!cities.find(city => city.value === participant.city_id)) {
        setCities([...cities, { value: participant.city_id, label: participant.city.name }])
      }
    }

    if (participant.city_id != null && participant.city_id > 0) {
      handleGetDistricts({ firstLoad: true, city: participant.city_id.toString() })
      if (!districts.find(district => district.value === participant.district_id)) {
        setDistricts([...districts, { value: participant.district_id, label: participant.district.name }])
      }
    }

    if (participant.district_id != null && participant.district_id > 0) {
      handleGetVillages({ firstLoad: true, district: participant.district_id.toString() })
      if (!villages.find(village => village.value === participant.village_id)) {
        setVillages([...villages, { value: participant.village_id, label: participant.village.name }])
      }
    }

    const initVal = {
      action: 'update',
      name: participant.user.name,
      phone_number: participant.user.phone_number,
      avatar: participant.user.avatar,
      bio: participant.bio ?? '',
      birthdate: participant.birthdate ? new Date(participant.birthdate) : new Date('1999-01-01'),
      gender: participant.gender ?? '',
      address: participant.address ?? '',
      province_id: participant.province_id,
      city_id: participant.city_id,
      district_id: participant.district_id,
      village_id: participant.village_id,
    }

    setFormInitialValue(initVal)
  }

  const handleGetProvinces = (firstLoad = false, id = '', name = '') => {
    setLoadingProvinces(true)
    getProvinces({ order: 'id,asc', limit: 40, page: 1, id, name })
      .then((res) => {
        if (res && res.status === 200) {
          const data = res.data.data.provinces
          const newProvinces = []
          if (data != null && data != undefined) {
            data.forEach(province => {
              newProvinces.push({ value: province.id, label: province.name })
            });
          }

          if (firstLoad) {
            setProvinces(newProvinces)
          } else {
            setFilteredProvinces(newProvinces)
          }
        }
        setLoadingProvinces(false)
      })
  }

  const handleGetCities = ({ firstLoad = false, province = '', id = '', name = '' }) => {
    setLoadingCities(true)
    getCities({ order: 'id,asc', limit: 200, page: 1, id, name, province })
      .then((res) => {
        if (res && res.status === 200) {
          const data = res.data.data.cities
          const newCities = []
          if (data != null && data != undefined) {
            data.forEach(city => {
              newCities.push({ value: city.id, label: city.name })
            });
          }

          if (firstLoad) {
            setCities(newCities)
          } else {
            setFilteredCities(newCities)
          }
        }
        setLoadingCities(false)
      })
  }

  const handleGetDistricts = ({ firstLoad = false, city = '', id = '', name = '' }) => {
    setLoadingDistricts(true)
    getDistricts({ order: 'id,asc', limit: 200, page: 1, id, name, city })
      .then((res) => {
        if (res && res.status === 200) {
          const data = res.data.data.districts
          const newDistricts = []
          if (data != null && data != undefined) {
            data.forEach(district => {
              newDistricts.push({ value: district.id, label: district.name })
            });
          }

          if (firstLoad) {
            setDistricts(newDistricts)
          } else {
            setFilteredDistricts(newDistricts)
          }
        }
        setLoadingDistricts(false)
      })
  }

  const handleGetVillages = ({ firstLoad = false, district = '', id = '', name = '' }) => {
    setLoadingVillages(true)
    getVillages({ order: 'id,asc', limit: 200, page: 1, id, name, district })
      .then((res) => {
        if (res && res.status === 200) {
          const data = res.data.data.villages
          const newVillages = []
          if (data != null && data != undefined) {
            data.forEach(village => {
              newVillages.push({ value: village.id, label: village.name })
            });
          }

          if (firstLoad) {
            setVillages(newVillages)
          } else {
            setFilteredVillages(newVillages)
          }
        }
        setLoadingVillages(false)
      })
  }

  const handleSubmit = async (values, { resetForm }) => {
    toast.close()

    // do nothing while waiting for avatar or CV upload
    if (avatarUploader.isLoading) {
      toast.send(
        'info',
        'Uploading File',
        'Please wait until avatar and resume upload finished'
      )
      return
    }

    // prevent submitting if avatar or CV upload is error
    if (avatarUploader.error) {
      toast.send(
        'info',
        'File Upload Failed',
        'Please make sure avatar and resume upload succeeded, otherwise try reuploading the file and try again'
      )
      return
    }

    try {
      const payload = JSON.parse(JSON.stringify(values));
      payload.bio = values.bio === '' ? null : values.bio
      payload.birthdate = toISOStringWithTimezone(values.birthdate).substring(0, 10)
      payload.avatar = avatarUploader.data?.file_url || participant.avatar

      const res = await putParticipantProfile(payload)
      if (res && res.data.code === 200) {
        const data = res.data.data
        setUser(data)

        toast.send(
          'success',
          'Changes Saved!',
          'Sucessfully update profile.'
        )

        mutate()
        resetForm()
        avatarUploader.reset()
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
        <title>Profile Setting | {siteTitle}</title>
      </Head>

      <Formik
        initialValues={formInitialValues}
        validationSchema={editProfileSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting, values }) => (
          <Form>
            <Grid
              templateColumns={{ base: '1fr', lg: 'max-content 1fr' }}
              alignItems='center'
              gap={8}
              p={8}
              mb={8}
              bg='gray.700'
              borderRadius='lg'
            >
              <GridItem>
                <VStack spacing={2}>
                  <Image
                    alt={`${participant?.name ?? 'participant'
                      }'s avatar`}
                    src={
                      avatarUploader?.data?.file_url ??
                      values?.avatar
                    }
                    fallbackSrc='/images/avatar-fallback.png'
                    boxSize='16ch'
                    borderRadius='full'
                    objectFit='cover'
                  />

                  <Button
                    variant='solid'
                    size='xs'
                    colorScheme='red'
                    onClick={onAvatarUploadModalOpen}
                  >
                    Change Avatar
                  </Button>

                  <Modal
                    closeOnOverlayClick={false}
                    isOpen={isAvatarUploadModalOpen}
                    onClose={onAvatarUploadModalClose}
                    isCentered
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalBody pt={8}>
                        <FileUploader
                          label='Upload Avatar'
                          accept='.png, .jpg, .jpeg'
                          isLoading={avatarUploader.isLoading}
                          isSuccess={isAvatarUploadSuccess}
                          error={avatarUploader.error?.message}
                          {...avatarUploader.inputFileProps}
                          currentFile={
                            participant?.avatar && {
                              url: participant?.avatar,
                              name: participant?.avatar
                                .split('/')
                                .slice(-1)[0]
                            }
                          }
                        />
                      </ModalBody>

                      <ModalFooter>
                        <HStack spacing={4}>
                          <Button
                            colorScheme='red'
                            onClick={onAvatarUploadModalClose}
                            isDisabled={avatarUploader.isLoading}
                          >
                            Save
                          </Button>
                          <Button
                            onClick={onAvatarUploadModalClose}
                            isDisabled={avatarUploader.isLoading}
                          >
                            Cancel
                          </Button>
                        </HStack>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </VStack>
              </GridItem>

              <GridItem>
                <VStack spacing={4}>
                  <FormControl
                    isRequired
                    isInvalid={touched.name && errors.name}
                  >
                    <FormLabel htmlFor='name'>Full Name</FormLabel>
                    <Field
                      as={Input}
                      variant='white'
                      id='name'
                      name='name'
                      type='text'
                      placeholder='Enter your full name here...'
                    />

                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={touched.bio && errors.bio}>
                    <FormLabel htmlFor='bio'>Bio</FormLabel>
                    <Field
                      as={Textarea}
                      variant='white'
                      id='bio'
                      name='bio'
                      type='text'
                      placeholder='Enter your bio here...'
                    />

                    <FormErrorMessage>{errors.bio}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </GridItem>
            </Grid>

            <VStack spacing={6} p={8} mb={8} bg='gray.700' borderRadius='lg'>
              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.birthdate && errors.birthdate}
                  >
                    <FormLabel htmlFor='birthdate'>Date of Birth</FormLabel>
                    <Field
                      component={DatePickerFormik}
                      id='birthdate'
                      name='birthdate'
                      placeholder='Enter your date of birth here...'
                    />

                    <FormErrorMessage>{errors.birthdate}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.gender && errors.gender}
                  >
                    <FormLabel htmlFor='gender'>Gender</FormLabel>
                    <Field id='gender' name='gender'>
                      {({
                        field, // { name, value, onChange, onBlur }
                      }) => (
                        <Select variant='white' placeholder='Select gender' {...field}>
                          <option value='male'>Male</option>
                          <option value='female'>Female</option>
                        </Select>
                      )}
                    </Field>

                    <FormErrorMessage>{errors.gender}</FormErrorMessage>
                  </FormControl>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.province_id && errors.province_id}
                  >
                    <FormLabel htmlFor='province_id'>Province</FormLabel>
                    <Field
                      component={AsyncSelectFormik}
                      id='province_id'
                      name='province_id'
                      type='number'
                      placeholder="Select a province"
                      isLoading={isLoadingProvinces}
                      defaultOptions={provinces}
                      loadOptions={(inputValue, callback) => {
                        handleGetProvinces(false, '', inputValue)
                        callback(filteredProvinces)
                      }}
                      onValueChange={(value, setFieldValue) => {
                        if (value != null) {
                          handleGetCities({ firstLoad: true, province: value.toString() })
                        }

                        if (values.city_id != null) {
                          setFieldValue('city_id', null)
                          selectCityRef.current.clearValue()
                        }

                        if (values.district_id != null) {
                          setFieldValue('district_id', null)
                          selectDistrictRef.current.clearValue()
                        }

                        if (values.village_id != null) {
                          setFieldValue('village_id', null)
                          selectVillageRef.current.clearValue()
                        }
                      }}
                    />

                    <FormErrorMessage>{errors.province_id}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.city_id && errors.city_id}
                  >
                    <FormLabel htmlFor='city_id'>City</FormLabel>
                    <Field
                      component={AsyncSelectFormik}
                      id='city_id'
                      name='city_id'
                      type='number'
                      placeholder="Select a city"
                      innerRef={selectCityRef}
                      isDisabled={!values.province_id}
                      isLoading={isLoadingCities}
                      defaultOptions={cities}
                      loadOptions={(inputValue, callback) => {
                        if (values.province_id != null) {
                          handleGetCities({ province: values.province_id.toString(), name: inputValue })
                          callback(filteredCities)
                        }
                      }}
                      onValueChange={(value, setFieldValue) => {
                        if (value != null) {
                          handleGetDistricts({ firstLoad: true, city: value.toString() })
                        }

                        if (values.district_id != null) {
                          setFieldValue('district_id', null)
                          selectDistrictRef.current.clearValue()
                        }

                        if (values.village_id != null) {
                          setFieldValue('village_id', null)
                          selectVillageRef.current.clearValue()
                        }
                      }}
                    />

                    <FormErrorMessage>{errors.city_id}</FormErrorMessage>
                  </FormControl>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.district_id && errors.district_id}
                  >
                    <FormLabel htmlFor='district_id'>District</FormLabel>
                    <Field
                      component={AsyncSelectFormik}
                      id='district_id'
                      name='district_id'
                      type='number'
                      placeholder="Select a district"
                      innerRef={selectDistrictRef}
                      isDisabled={!values.city_id}
                      isLoading={isLoadingDistricts}
                      defaultOptions={districts}
                      loadOptions={(inputValue, callback) => {
                        if (values.city_id != null) {
                          handleGetDistricts({ city: values.city_id.toString(), name: inputValue })
                          callback(filteredDistricts)
                        }
                      }}
                      onValueChange={(value, setFieldValue) => {
                        if (value != null) {
                          handleGetVillages({ firstLoad: true, district: value.toString() })
                        }

                        if (values.village_id != null) {
                          setFieldValue('village_id', null)
                          selectVillageRef.current.clearValue()
                        }
                      }}
                    />

                    <FormErrorMessage>{errors.district_id}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.village_id && errors.village_id}
                  >
                    <FormLabel htmlFor='village_id'>Village</FormLabel>
                    <Field
                      component={AsyncSelectFormik}
                      id='village_id'
                      name='village_id'
                      type='number'
                      placeholder="Select a village"
                      innerRef={selectVillageRef}
                      isDisabled={!values.district_id}
                      isLoading={isLoadingVillages}
                      defaultOptions={villages}
                      loadOptions={(inputValue, callback) => {
                        if (values.district_id != null) {
                          handleGetVillages({ district: values.district_id.toString(), name: inputValue })
                          callback(filteredVillages)
                        }
                      }}
                    />

                    <FormErrorMessage>{errors.village_id}</FormErrorMessage>
                  </FormControl>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={1} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.address && errors.address}
                  >
                    <FormLabel htmlFor='address'>Address</FormLabel>
                    <Field
                      as={Textarea}
                      variant='white'
                      id='address'
                      name='address'
                      type='text'
                      placeholder='Enter your address here...'
                    />

                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  </FormControl>
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
                    avatarUploader.isLoading
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
