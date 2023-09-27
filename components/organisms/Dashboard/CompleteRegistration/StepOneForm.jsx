import { useEffect, useRef, useState } from 'react'

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    VStack,
    SimpleGrid,
    Box,
    Select,
    Textarea,
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import 'yup-phone-lite'

import DatePickerFormik from 'components/atoms/DatePicker/index'
import AsyncSelectFormik from 'components/atoms/Select/AsyncSelectFormik';
import { useFormToast } from 'hooks/form-toast'
import { getCities, getDistricts, getProvinces, getVillages } from 'services/region'

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
    village_id: null
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
})

export default function CompleteRegistrationForm1() {
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

    const handleGetProvinces = (firstLoad = false, id = '', name = '') => {
        setLoadingProvinces(true)
        getProvinces({ order: 'id,asc', limit: 40, page: 1, id, name })
            .then((res) => {
                if (res && res.status === 200) {
                    const data = res.data.data.provinces
                    const newProvinces = []
                    data.forEach(province => {
                        newProvinces.push({ value: province.id, label: province.name })
                    });

                    if (firstLoad) {
                        setProvinces(newProvinces)
                    } else {
                        setFilteredProvinces(newProvinces)
                    }
                }
                setLoadingProvinces(false)
            })
    }

    const handleGetCities = ({firstLoad=false, province = '', id = '', name = '' }) => {
        setLoadingCities(true)
        getCities({ order: 'id,asc', limit: 200, page: 1, id, name, province })
            .then((res) => {
                if (res && res.status === 200) {
                    const data = res.data.data.cities
                    const newCities = []
                    data.forEach(city => {
                        newCities.push({ value: city.id, label: city.name })
                    });

                    if (firstLoad) {
                        setCities(newCities)
                    } else {
                        setFilteredCities(newCities)
                    }
                }
                setLoadingCities(false)
            })
    }

    const handleGetDistricts = ({firstLoad=false, city = '', id = '', name = '' }) => {
        setLoadingDistricts(true)
        getDistricts({ order: 'id,asc', limit: 200, page: 1, id, name, city })
            .then((res) => {
                if (res && res.status === 200) {
                    const data = res.data.data.districts
                    const newDistricts = []
                    data.forEach(district => {
                        newDistricts.push({ value: district.id, label: district.name })
                    });

                    if (firstLoad) {
                        setDistricts(newDistricts)
                    } else {
                        setFilteredDistricts(newDistricts)
                    }
                }
                setLoadingDistricts(false)
            })
    }

    const handleGetVillages = ({firstLoad=false, district = '', id = '', name = '' }) => {
        setLoadingVillages(true)
        getVillages({ order: 'id,asc', limit: 200, page: 1, id, name, district })
            .then((res) => {
                if (res && res.status === 200) {
                    const data = res.data.data.villages
                    const newVillages = []
                    data.forEach(village => {
                        newVillages.push({ value: village.id, label: village.name })
                    });

                    if (firstLoad) {
                        setVillages(newVillages)
                    } else {
                        setFilteredVillages(newVillages)
                    }
                }
                setLoadingVillages(false)
            })
    }

    const toast = useFormToast('complete-registration-1')
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
            {({ errors, touched, isSubmitting, values }) => (
                <Form>
                    <VStack spacing={6}>
                        <SimpleGrid columns={2} spacing={20} w='100%'>
                            <Box w='100%'>
                                <FormControl
                                    isRequired
                                    isInvalid={touched.birtdate && errors.birtdate}
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
                                                handleGetCities({firstLoad: true, province: value.toString()})
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
                                                handleGetDistricts({firstLoad: true, city: value.toString()})
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
                                                handleGetVillages({firstLoad: true, district: value.toString()})
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
                </Form>
            )}
        </Formik>
    )
}
