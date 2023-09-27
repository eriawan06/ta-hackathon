import { useEffect, useState } from 'react'
import Head from 'next/head'

import {
  VStack,
  Box,
  SimpleGrid,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Button,
} from '@chakra-ui/react'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import 'yup-phone-lite'

import { useFormToast } from 'hooks/form-toast'

import { useParticipantProfile } from 'hooks/swr/users'
import { putParticipantAccount } from 'services/users'

import DashboardSettingLayout from 'layouts/DashboardSettingLayout'

import { siteTitle } from 'config'
import { useRouter } from 'node_modules/next/router'
import { setUser } from 'libs/local-storage/user'

const initialValues = {
  username: '',
  phone_number: '+62',
}

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Required'),
  phone_number: Yup.string()
    .phone('id', 'Please enter a valid phone number')
    .min(8, 'Phone number is at least 8 digits')
    .min(8, 'Phone number is maximum 14 digits')
    .required('Required'),
})

DashboardSettingAccount.getLayout = (page) => {
  return <DashboardSettingLayout>{page}</DashboardSettingLayout>
}

export default function DashboardSettingAccount() {
  const toast = useFormToast('account-panel')
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
      username: participant.user.username ?? '',
      phone_number: participant.user.phone_number,
    }

    setFormInitialValue(initVal)
  }

  const handleSubmit = async (values, { resetForm }) => {
    toast.close()

    try {
      const res = await putParticipantAccount(values)
      if (res && res.data.code === 200) {
        const data = res.data.data
        setUser(data)

        toast.send(
          'success',
          'Changes Saved!',
          'Sucessfully update account.'
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
        <title>Account Settings | {siteTitle}</title>
      </Head>

      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <VStack spacing={6} p={8} mb={8} bg='gray.700' borderRadius='lg'>
              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.username && errors.username}
                  >
                    <FormLabel htmlFor='username'>Username</FormLabel>
                    <Field
                      as={Input}
                      variant='white'
                      id='username'
                      name='username'
                      type='text'
                      placeholder='Enter your username here...'
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.phone_number && errors.phone_number}
                  >
                    <FormLabel htmlFor='phone_number'>Phone Number</FormLabel>
                    <Field
                      as={Input}
                      variant='white'
                      id='phone_number'
                      name='phone_number'
                      type='text'
                      placeholder='Enter your phone number here...'
                    />
                    <FormErrorMessage>{errors.phone_number}</FormErrorMessage>
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
