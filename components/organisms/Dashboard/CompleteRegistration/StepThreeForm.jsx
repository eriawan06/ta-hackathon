import { useEffect, useState } from 'react'

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    VStack,
    SimpleGrid,
    Box,
    Heading,
    Input,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import 'yup-phone-lite'
import AsyncSelectFormik from 'components/atoms/Select/AsyncSelectFormik';

import { useFormToast } from 'hooks/form-toast'
import { getOccupations, getSkills, getSpecialities } from 'services/master-data'
import FileUploader from 'components/molecules/FileUploader/index'
import { useFileUploader } from 'hooks/upload'

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
    portfolio: Yup.string()
        .required('Required'),
    repository: Yup.string()
        .required('Required'),
    linkedin: Yup.string()
        .required('Required'),
    speciality_id: Yup.number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('Required'),
    skills: Yup.array()
        .min(1, 'Required')
        .required('Required'),
})

export default function CompleteRegistrationForm3() {
    const [occupations, setOccupations] = useState([])
    const [filteredOccupations, setFilteredOccupations] = useState([])
    const [isLoadingOccupations, setLoadingOccupations] = useState(true)

    const [specialities, setSpecialities] = useState([])
    const [filteredSpecialities, setFilteredSpecialities] = useState([])
    const [isLoadingSpecialities, setLoadingSpecialities] = useState(true)

    const [skills, setSkills] = useState([])
    const [filteredSkills, setFilteredSkills] = useState([])
    const [isLoadingSkills, setLoadingSkills] = useState(true)

    useEffect(() => {
        handleGetOccupations({ firstLoad: true })
        handleGetSpecialities({ firstLoad: true })
        handleGetSkills({ firstLoad: true })
    }, [])

    const handleGetOccupations = ({ firstLoad = false, name = '' }) => {
        setLoadingOccupations(true)
        getOccupations({ order: 'id,asc', limit: 100, page: 1, status: 'active', name })
            .then((res) => {
                if (res && res.status === 200) {
                    const data = res.data.data.occupations
                    const newOccupations = []
                    data.forEach(occupation => {
                        newOccupations.push({ value: occupation.id, label: occupation.name })
                    });

                    if (firstLoad) {
                        setOccupations(newOccupations)
                    } else {
                        setFilteredOccupations(newOccupations)
                    }
                }
                setLoadingOccupations(false)
            })
    }

    const handleGetSpecialities = ({ firstLoad = false, name = '' }) => {
        setLoadingSpecialities(true)
        getSpecialities({ order: 'id,asc', limit: 100, page: 1, status: 'active', name })
            .then((res) => {
                if (res && res.status === 200) {
                    const data = res.data.data.specialities
                    const newSpecialities = []
                    data.forEach(speciality => {
                        newSpecialities.push({ value: speciality.id, label: speciality.name })
                    });

                    if (firstLoad) {
                        setSpecialities(newSpecialities)
                    } else {
                        setFilteredSpecialities(newSpecialities)
                    }
                }
                setLoadingSpecialities(false)
            })
    }

    const handleGetSkills = ({ firstLoad = false, name = '' }) => {
        setLoadingSkills(true)
        getSkills({ order: 'id,asc', limit: 100, page: 1, status: 'active', name })
            .then((res) => {
                if (res && res.status === 200) {
                    const data = res.data.data.skills
                    const newSkills = []
                    data.forEach(skill => {
                        newSkills.push({ value: skill.id, label: skill.name })
                    });

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
        validate: (files) => files[0].size > 1000000 ? ['maximum file size is 2MB'] : null,
        // previousFile: participantProfile?.resume
    })

    const isResumeUploadSuccess = resumeUploader.data && !resumeUploader.isLoading && !resumeUploader.error

    const toast = useFormToast('complete-registration-3')
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
                    <VStack spacing={3} alignItems='start' mb={6} >
                        <Heading as='h3' fontSize='2xl'>
                            Experience
                        </Heading>
                    </VStack>

                    <VStack spacing={6} mb={20}>
                        <SimpleGrid columns={2} spacing={20} w='100%'>
                            <Box w='100%'>
                                <FormControl
                                    isRequired
                                    isInvalid={touched.occupation_id && errors.occupation_id}
                                >
                                    <FormLabel htmlFor='occupation_id'>Occupation</FormLabel>
                                    <Field
                                        component={AsyncSelectFormik}
                                        id='occupation_id'
                                        name='occupation_id'
                                        type='number'
                                        placeholder="Select an occupation"
                                        isLoading={isLoadingOccupations}
                                        defaultOptions={occupations}
                                        loadOptions={(inputValue, callback) => {
                                            handleGetOccupations({ name: inputValue })
                                            callback(filteredOccupations)
                                        }}
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

                        <SimpleGrid columns={2} spacing={20} w='100%'>
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

                        <SimpleGrid columns={2} spacing={20} w='100%'>
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

                        <SimpleGrid columns={1} w='100%'>
                            <Box w='100%'>
                                <FileUploader
                                    label='Upload Resume/CV'
                                    accept='.pdf'
                                    isLoading={resumeUploader.isLoading}
                                    isSuccess={isResumeUploadSuccess}
                                    error={resumeUploader.error?.message}
                                    {...resumeUploader.inputFileProps}
                                    // currentFile={
                                    //     participantProfile?.resume && {
                                    //         url: participantProfile.resume,
                                    //         name: participantProfile.resume.split('/').slice(-1)[0]
                                    //     }
                                    // }
                                />
                            </Box>
                        </SimpleGrid>
                    </VStack>

                    <VStack spacing={3} alignItems='start' mb={6}>
                        <Heading as='h3' fontSize='2xl'>
                            Preference
                        </Heading>
                    </VStack>

                    <VStack spacing={6}>
                        <SimpleGrid columns={2} spacing={20} w='100%'>
                            <Box w='100%'>
                                <FormControl
                                    isRequired
                                    isInvalid={touched.speciality_id && errors.speciality_id}
                                >
                                    <FormLabel htmlFor='speciality_id'>What is your speciality?</FormLabel>
                                    <Field
                                        component={AsyncSelectFormik}
                                        id='speciality_id'
                                        name='speciality_id'
                                        type='number'
                                        placeholder="Select a speciality"
                                        isLoading={isLoadingSpecialities}
                                        defaultOptions={specialities}
                                        loadOptions={(inputValue, callback) => {
                                            handleGetSpecialities({ name: inputValue })
                                            callback(filteredSpecialities)
                                        }}
                                    />

                                    <FormErrorMessage>{errors.speciality_id}</FormErrorMessage>
                                </FormControl>
                            </Box>

                            <Box w='100%'>
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
                                    />

                                    <FormErrorMessage>{errors.skills}</FormErrorMessage>
                                </FormControl>
                            </Box>
                        </SimpleGrid>
                    </VStack>
                </Form>
            )}
        </Formik>
    )
}
