import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    VStack,
    SimpleGrid,
    Box,
    Select,
    Input,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import 'yup-phone-lite'

import { useFormToast } from 'hooks/form-toast'
import capitalizeFirst from 'libs/stringLib'

const levelOfStudies = ['high school', 'undergraduate', 'postgraduate']

const initialValues = {
    level_of_study: '',
    school: '',
    graduation_year: 0,
    major: ''
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

export default function CompleteRegistrationForm2() {
    const toast = useFormToast('complete-registration-2')
    const handleSubmit = (values) => {
        toast.close()
        console.log('VALUES', values)
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <VStack spacing={6}>
                        <SimpleGrid columns={2} spacing={20} w='100%'>
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

                        <SimpleGrid columns={2} spacing={20} w='100%'>
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
                </Form>
            )}
        </Formik>
    )
}
