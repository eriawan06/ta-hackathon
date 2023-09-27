import { useState } from 'react'
import { useRouter } from 'next/router'

import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack
} from '@chakra-ui/react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import { useFormToast } from 'hooks/form-toast'
import { postAuthForgotPassword } from 'services/auth'

const initialValues = {
  password: '',
  confirm_password: ''
}

const forgotPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password is at least 8 characters!')
    .max(20, 'Password is maximum 20 characters!')
    .required('Required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required')
})

export default function ForgotPasswordFormStep2(verificationCode) {
  const router = useRouter()
  const toast = useFormToast('forgot-password-form-step-1')

  const [showPassword, setShowPassword] = useState(false)
  const handleToggleShowPassword = () => setShowPassword(!showPassword)

  const handleSubmit = async (values) => {
    toast.close()

    try {
      const res = await postAuthForgotPassword({
        verification_code: verificationCode.verificationCode,
        new_password: values.password
      })

      if (res && res.status === 200) {
        toast.send(
          'success',
          'Password Reset Sucessfully!',
          'Redirecting you to login page in 5 seconds...'
        )

        setTimeout(() => {
          router.push('/auth/login')
        }, 5000)
      }
    } catch (err) {
      let title = 'Form Error!'
      let message = err.message

      if (err.response.status === 400) {
        title = 'Reset Password Failed!'
        message = 'Please get new verification email and try again!'
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
              isInvalid={touched.password && errors.password}
            >
              <FormLabel htmlFor='password'>Password</FormLabel>

              <InputGroup>
                <Field
                  as={Input}
                  variant='white'
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password here...'
                />
                <InputRightElement>
                  <IconButton
                    variant='ghost'
                    color='black'
                    icon={showPassword ? <BsEyeSlash /> : <BsEye />}
                    aria-label={
                      showPassword ? 'Hide Password' : 'Show Password'
                    }
                    onClick={handleToggleShowPassword}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={touched.confirm_password && errors.confirm_password}
            >
              <FormLabel htmlFor='confirm_password'>
                Password Confirmation
              </FormLabel>
              <Field
                as={Input}
                variant='white'
                id='confirm_password'
                name='confirm_password'
                type='password'
                placeholder='Re-enter your password here...'
              />
              <FormErrorMessage>{errors.confirm_password}</FormErrorMessage>
            </FormControl>
          </VStack>

          <VStack
            spacing={3}
            w='full'
          >
            <Button
              type='submit'
              colorScheme='red'
              w='full'
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Change Password
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}
