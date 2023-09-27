import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    VStack,
    SimpleGrid,
    Box,
    Select,
    Input,
    Textarea,
    Button,
    Heading,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import 'yup-phone-lite'

import DatePickerFormik from 'components/atoms/DatePicker/index'
import AsyncSelectFormik from 'components/atoms/Select/AsyncSelectFormik';
import { useFormToast } from 'hooks/form-toast'
import { getCities, getDistricts, getProvinces, getVillages } from 'services/region'
import capitalizeFirst from 'libs/stringLib'
import { useFileUploader } from 'hooks/upload'
import FileUploader from 'components/molecules/FileUploader/index'
import { createOccupation, createSpeciality, getOccupations, getSkills } from 'services/master-data'
import { getSpecialities } from 'services/references'
import AsyncCreatableSelectFormik from 'components/atoms/Select/AsyncCreatableSelectFormik'
import { useParticipantProfile } from 'hooks/swr/users'
import { putParticipant } from 'services/users'
import { toISOStringWithTimezone } from 'libs/dateFormatter'
import { setUser } from 'libs/local-storage/user'

const levelOfStudies = ['high school', 'undergraduate', 'postgraduate']

const initialValues = {
    action: 'register',
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
    level_of_study: '',
    school: '',
    graduation_year: 0,
    major: '',
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
    level_of_study: Yup.string()
        .oneOf(levelOfStudies, 'Invalid level of study')
        .required('Required'),
    school: Yup.string()
        .required('Required'),
    graduation_year: Yup.number()
        .transform(value => (isNaN(value) ? undefined : value))
        .required('Required'),
    major: Yup.string().nullable(true),
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

export default function CompleteRegistrationForm() {
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
        handleGetProvinces(true)
        handleGetOccupations({ firstLoad: true })
        handleGetSpecialities({ firstLoad: true })
        handleGetSkills({ firstLoad: true })
    }, [])

    const {
        error,
        data: participant,
        isLoadingData,
        mutate
    } = useParticipantProfile()
    const [formInitialValues, setFormInitialValue] = useState(initialValues)

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
            action: 'register',
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
            level_of_study: participant.level_of_study ?? '',
            school: participant.school ?? '',
            graduation_year: participant.graduation_year,
            major: participant.major ?? '',
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
        validate: (files) => files[0].size > 1000000 ? ['maximum file size is 2MB'] : null,
        // previousFile: participantProfile?.resume
    })

    const isResumeUploadSuccess = resumeUploader.data && !resumeUploader.isLoading && !resumeUploader.error

    const toast = useFormToast('complete-registration-1')
    const handleSubmit = async (values, { resetForm }) => {
        toast.close()
        console.log('VALUES', values)


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
            payload.bio = values.bio === '' ? null : values.bio
            payload.birthdate = toISOStringWithTimezone(values.birthdate).substring(0, 10)
            payload.graduation_year = parseInt(values.graduation_year)
            payload.major = values.major === '' ? null : values.major
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

            console.log('PAYLOAD: ', payload);

            const res = await putParticipant(payload)
            if (res && res.data.code === 200) {
                const data = res.data.data
                console.log('RES DATA: ', data)
                setUser(data)

                toast.send(
                    'success',
                    'Registration is completed',
                    'Sucessfully complete registration.'
                )

                mutate()
                resetForm()
                resumeUploader.reset()
                setTimeout(() => router.push('/dashboard'), 3000)
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
        <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, isSubmitting, values }) => (
                <Form>
                    <VStack spacing={3} alignItems='start' mb={6} >
                        <Box w='full' borderBottom="1px solid red" pb={3}>
                            <Heading as='h3' fontSize='2xl'>
                                Profile & Location
                            </Heading>
                        </Box>
                    </VStack>

                    <VStack spacing={6} mb={20}>
                        <SimpleGrid columns={2} spacing={20} w='100%'>
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

                        <SimpleGrid columns={2} spacing={20} w='100%'>
                            <Box w='100%'>
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
                            </Box>

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

                        <SimpleGrid columns={2} spacing={20} w='100%'>
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

                        <SimpleGrid columns={2} spacing={20} w='100%'>
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
                    </VStack>

                    <VStack spacing={3} alignItems='start' mb={6} >
                        <Box w='full' borderBottom="1px solid red" pb={3}>
                            <Heading as='h3' fontSize='2xl'>
                                Education
                            </Heading>
                        </Box>
                    </VStack>

                    <VStack spacing={6} mb={20}>
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

                    <VStack spacing={3} alignItems='start' mb={6} >
                        <Box w='full' borderBottom="1px solid red" pb={3}>
                            <Heading as='h3' fontSize='2xl'>
                                Experience
                            </Heading>
                        </Box>
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
                                    currentFile={
                                        participant?.resume && {
                                            url: participant.resume,
                                            name: participant.resume.split('/').slice(-1)[0]
                                        }
                                    }
                                />
                            </Box>
                        </SimpleGrid>
                    </VStack>

                    <VStack spacing={3} alignItems='start' mb={6} >
                        <Box w='full' borderBottom="1px solid red" pb={3}>
                            <Heading as='h3' fontSize='2xl'>
                                Preference
                            </Heading>
                        </Box>
                    </VStack>

                    <VStack spacing={6} mb={20}>
                        <SimpleGrid columns={2} spacing={20} w='100%'>
                            <Box w='100%'>
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
                            </Box>
                        </SimpleGrid>
                    </VStack>

                    <VStack spacing={3} w='full'>
                        <Button
                            type='submit'
                            colorScheme='red'
                            isDisabled={isSubmitting}
                            isLoading={isSubmitting}
                            w='full'
                        >
                            Submit
                        </Button>
                    </VStack>
                </Form>
            )}
        </Formik>
    )
}
