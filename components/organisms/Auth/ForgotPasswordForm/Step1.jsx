import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack
} from '@chakra-ui/react'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useFormToast } from 'hooks/form-toast'

import { postAuthGetVerificationCode } from 'services/auth'

const initialValues = {
  email: ''
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Required')
})

export default function ForgotPasswordFormStep1() {
  const toast = useFormToast('forgot-password-form-step-1')

  const handleSubmit = async (values) => {
    toast.close()

    try {
      const res = await postAuthGetVerificationCode({
        ...values,
        type: 'reset-password'
      })

      if (res && res.status === 200) {
        toast.send(
          'success',
          'Please Check Your Email!',
          'If the email you entered is valid, you will receive an email for the next step in resetting your password.'
        )
      }
    } catch (err) {
      let title = 'Form Error!'
      let message = err.message

      if (err.response.status === 400) {
        title = 'Reset Password Failed!'
        message =
          'Please make sure the email you entered is valid and registered.'
      }

      toast.send('error', title, message)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={forgotPasswordSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <VStack
            spacing={6}
            mb={8}
          >
            <FormControl
              isRequired
              isInvalid={touched.email && errors.email}
            >
              <FormLabel htmlFor='email'>Email Address</FormLabel>
              <Field
                as={Input}
                variant='white'
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email here...'
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
          </VStack>

          <VStack
            spacing={3}
            w='full'
          >
            <Button
              type='submit'
              colorScheme='red'
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              w='full'
            >
              Reset Password
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}
