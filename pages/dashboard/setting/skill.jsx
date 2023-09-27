import { useEffect, useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Input,
  Select,
  VStack,
  FormHelperText
} from '@chakra-ui/react'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import SkillSuggestions from 'components/molecules/Dashboard/SkillSugesstions'

import DashboardSettingLayout from 'layouts/DashboardSettingLayout'

import { useFormToast } from 'hooks/form-toast'

import { useSpecialities } from 'hooks/swr/references'
import { useParticipantProfile } from 'hooks/swr/users'
import { putParticipantPreference } from 'services/users'

import { siteTitle } from 'config'

const initialValues = {
  speciality_id: '',
  skills: ''
}

const editSkillSchema = Yup.object().shape({
  speciality_id: Yup.number('Please select a valid speciality').nullable(true),
  skills: Yup.string().nullable(true)
})

DashboardSettingSkill.getLayout = (page) => {
  return <DashboardSettingLayout>{page}</DashboardSettingLayout>
}

export default function DashboardSettingSkill() {
  const { data: specialities } = useSpecialities()
  const {
    data: participantProfile,
    isLoading,
    error,
    mutate
  } = useParticipantProfile()

  const [formInitialValues, setFormInitialValue] = useState(initialValues)

  const toast = useFormToast('skill-panel')

  useEffect(() => {
    if (!isLoading && !error)
      setFormInitialValue({
        speciality_id: participantProfile.speciality_id,
        skills: participantProfile.skills
      })
  }, [error, isLoading, participantProfile])

  const handleSubmit = async (values, { resetForm }) => {
    toast.close()

    try {
      const res = await putParticipantPreference({
        skills: values.skills !== '' ? values.skills : null,
        speciality_id: values.speciality_id
          ? parseInt(values.speciality_id)
          : null
      })

      if (res && res.data.code === 200) {
        toast.send(
          'success',
          'Changes Saved!',
          'Sucessfully update the skill setting.'
        )

        mutate()
        resetForm()
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
        <title>Skill Setting | {siteTitle}</title>
      </Head>

      <Formik
        initialValues={formInitialValues}
        validationSchema={editSkillSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <VStack
              spacing={4}
              maxW='60ch'
            >
              <FormControl
                isInvalid={touched.speciality_id && errors.speciality_id}
              >
                <FormLabel htmlFor='speciality_id'>Speciality</FormLabel>
                <Field
                  as={Select}
                  variant='white'
                  id='speciality_id'
                  name='speciality_id'
                  placeholder='Enter your speciality here...'
                >
                  {specialities &&
                    specialities.map((option) => (
                      <option
                        key={`speciality_id-option-${option.id}`}
                        value={option.id}
                      >
                        {option.speciality_name}
                      </option>
                    ))}
                </Field>
                <FormErrorMessage>{errors.speciality_id}</FormErrorMessage>
              </FormControl>

              <Box w='full'>
                <FormControl
                  isInvalid={touched.skills && errors.skills}
                  mb={2}
                >
                  <FormLabel htmlFor='skills'>Skill</FormLabel>
                  <Field
                    as={Input}
                    variant='white'
                    id='skills'
                    name='skills'
                    type='text'
                    placeholder='Enter your skill here...'
                  />
                  <FormErrorMessage>{errors.skills}</FormErrorMessage>
                  <FormHelperText>Separate skill with comma</FormHelperText>
                </FormControl>

                <SkillSuggestions />
              </Box>

              <HStack
                spacing={4}
                w='full'
              >
                <Button
                  type='submit'
                  colorScheme='red'
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Save Changes
                </Button>

                <NextLink
                  href='/dashboard'
                  passHref
                >
                  <Button
                    as='a'
                    variant='solid'
                    colorScheme='gray'
                  >
                    Back
                  </Button>
                </NextLink>
              </HStack>
            </VStack>
          </Form>
        )}
      </Formik>
    </>
  )
}
