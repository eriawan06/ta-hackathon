import { useEffect, useState } from 'react'
import Head from 'next/head'

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  SimpleGrid,
  Box,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react'

import DashboardSettingLayout from 'layouts/DashboardSettingLayout'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useFormToast } from 'hooks/form-toast'

import { useParticipantProfile } from 'hooks/swr/users'
import { putParticipantEducation } from 'services/users'

import { siteTitle } from 'config'
import { useRouter } from 'node_modules/next/router'
import { setUser } from 'libs/local-storage/user'
import capitalizeFirst from 'libs/stringLib'

const levelOfStudies = ['high school', 'undergraduate', 'postgraduate']

const initialValues = {
  level_of_study: '',
  school: '',
  graduation_year: 0,
  major: '',
}

const validationSchema = Yup.object().shape({
  level_of_study: Yup.string()
    .oneOf(levelOfStudies, 'Invalid level of study')
    .required('Required'),
  school: Yup.string()
    .required('Required'),
  graduation_year: Yup.number()
    .transform(value => (isNaN(value) ? undefined : value))
    .required('Required'),
  major: Yup.string().nullable(true),
})

DashboardSettingEducation.getLayout = (page) => {
  return <DashboardSettingLayout>{page}</DashboardSettingLayout>
}

export default function DashboardSettingEducation() {
  const toast = useFormToast('education-panel')
  const router = useRouter()

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
    const initVal = {
      level_of_study: participant.level_of_study ?? '',
      school: participant.school ?? '',
      graduation_year: participant.graduation_year,
      major: participant.major ?? '',
    }

    setFormInitialValue(initVal)
  }

  const handleSubmit = async (values, { resetForm }) => {
    toast.close()
    try {
      const payload = JSON.parse(JSON.stringify(values));
      payload.major = values.major === '' ? null : values.major
      payload.graduation_year = parseInt(values.graduation_year)

      const res = await putParticipantEducation(payload)
      if (res && res.data.code === 200) {
        const data = res.data.data
        setUser(data)

        toast.send(
          'success',
          'Changes Saved!',
          'Sucessfully update education.'
        )

        mutate()
        resetForm()
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
        <title>Education Setting | {siteTitle}</title>
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
                    isInvalid={touched.level_of_study && errors.level_of_study}
                  >
                    <FormLabel htmlFor='level_of_study'>Level of Study</FormLabel>
                    <Field id='level_of_study' name='level_of_study'>
                      {({
                        field, // { name, value, onChange, onBlur }
                      }) => (
                        <Select variant='white' placeholder='Select level of study' {...field}>
                          {
                            levelOfStudies.map((data, i) => <option key={i} value={data}>{capitalizeFirst(data)}</option>)
                          }
                        </Select>
                      )}
                    </Field>

                    <FormErrorMessage>{errors.level_of_study}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.school && errors.school}
                  >
                    <FormLabel htmlFor='school'>School</FormLabel>
                    <Field
                      as={Input}
                      variant='white'
                      id='school'
                      name='school'
                      type='text'
                      placeholder='Enter your school here...'
                    />
                    <FormErrorMessage>{errors.school}</FormErrorMessage>
                  </FormControl>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.graduation_year && errors.graduation_year}
                  >
                    <FormLabel htmlFor='graduation_year'>Graduation Year</FormLabel>
                    <Field id='graduation_year' name='graduation_year'>
                      {({
                        field, // { name, value, onChange, onBlur }
                      }) => (
                        <Select variant='white' placeholder='Select graduation year' {...field}>
                          {(() => {
                            const arr = [];
                            const yearStart = 2010;
                            const yearEnd = (new Date).getFullYear() + 4;
                            for (let i = yearStart; i <= yearEnd; i++) {
                              arr.push(<option key={i} value={i}>{i.toString()}</option>)
                            }
                            return arr
                          })()}
                        </Select>
                      )}
                    </Field>

                    <FormErrorMessage>{errors.graduation_year}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w='100%'>
                  <FormControl isInvalid={touched.major && errors.major}>
                    <FormLabel htmlFor='major'>Major</FormLabel>
                    <Field
                      as={Input}
                      variant='white'
                      id='major'
                      name='major'
                      type='text'
                      placeholder='Enter your major here...'
                    />
                    <FormErrorMessage>{errors.major}</FormErrorMessage>
                  </FormControl>
                </Box>
              </SimpleGrid>
            </VStack>

            <SimpleGrid columns={1} w='100%'>
              <Box w='30%'>
                <Button
                  colorScheme='red'
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting}
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
