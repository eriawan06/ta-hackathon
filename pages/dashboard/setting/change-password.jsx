import { useState } from 'react'
import Head from 'next/head'

import {
  VStack,
  Box,
  SimpleGrid,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import 'yup-phone-lite'

import { useFormToast } from 'hooks/form-toast'

import { putChangePassword } from 'services/users'

import DashboardSettingLayout from 'layouts/DashboardSettingLayout'

import { siteTitle } from 'config'
import { useRouter } from 'node_modules/next/router'

const initialValues = {
  old_password: "",
  new_password: "",
  confirm_new_password: ""
}

const validationSchema = Yup.object().shape({
  old_password: Yup.string()
    .min(8, 'New password must be at least 8 characters!')
    .max(20, 'New password must be maximum 20 characters!')
    .required('Required'),
  new_password: Yup.string()
    .min(8, 'New password must be at least 8 characters!')
    .max(20, 'New password must be maximum 20 characters!')
    .required('Required'),
  confirm_new_password: Yup.string()
    .min(8, 'Confirm new password must be at least 8 characters!')
    .max(20, 'Confirm new password must be maximum 20 characters!')
    .oneOf([Yup.ref('new_password'), null], 'New password must match')
    .required('Required'),
})

DashboardSettingPassword.getLayout = (page) => {
  return <DashboardSettingLayout>{page}</DashboardSettingLayout>
}

export default function DashboardSettingPassword() {
  const toast = useFormToast('change-password-panel')
  const router = useRouter()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const handleSubmit = async (values, { resetForm }) => {
    toast.close()

    try {
      const res = await putChangePassword(values)
      if (res && res.data.code === 200) {
        toast.send(
          'success',
          'Changes Saved!',
          'Sucessfully change password.'
        )

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
        <title>Change Password | {siteTitle}</title>
      </Head>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <VStack spacing={6} p={8} mb={8} bg='gray.700' borderRadius='lg'>
              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.old_password && errors.old_password}
                  >
                    <FormLabel htmlFor='old_password'>Old Password</FormLabel>

                    <InputGroup>
                      <Field
                        as={Input}
                        variant='white'
                        id='old_password'
                        name='old_password'
                        type={showOldPassword ? 'text' : 'password'}
                        placeholder='Enter your old password here...'
                      />
                      <InputRightElement>
                        <IconButton
                          variant='ghost'
                          color='black'
                          icon={showOldPassword ? <BsEyeSlash /> : <BsEye />}
                          aria-label={
                            showOldPassword ? 'Hide Password' : 'Show Password'
                          }
                          onClick={() => setShowOldPassword(!showOldPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.old_password}</FormErrorMessage>
                  </FormControl>
                </Box>

                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.new_password && errors.new_password}
                  >
                    <FormLabel htmlFor='new_password'>New Password</FormLabel>

                    <InputGroup>
                      <Field
                        as={Input}
                        variant='white'
                        id='new_password'
                        name='new_password'
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder='Enter your new password here...'
                      />
                      <InputRightElement>
                        <IconButton
                          variant='ghost'
                          color='black'
                          icon={showNewPassword ? <BsEyeSlash /> : <BsEye />}
                          aria-label={
                            showNewPassword ? 'Hide Password' : 'Show Password'
                          }
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.new_password}</FormErrorMessage>
                  </FormControl>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={12} w='100%'>
                <Box w='100%'>
                  <FormControl
                    isRequired
                    isInvalid={touched.confirm_new_password && errors.confirm_new_password}
                  >
                    <FormLabel htmlFor='confirm_new_password'>Confirm New Password</FormLabel>

                    <InputGroup>
                      <Field
                        as={Input}
                        variant='white'
                        id='confirm_new_password'
                        name='confirm_new_password'
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        placeholder='Enter your new password again here...'
                      />
                      <InputRightElement>
                        <IconButton
                          variant='ghost'
                          color='black'
                          icon={showConfirmNewPassword ? <BsEyeSlash /> : <BsEye />}
                          aria-label={
                            showConfirmNewPassword ? 'Hide Password' : 'Show Password'
                          }
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.confirm_new_password}</FormErrorMessage>
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
