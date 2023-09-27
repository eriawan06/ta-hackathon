import {
  Box,
  Heading,
  Text,
  Select,
  Input,
  Flex
} from '@chakra-ui/react'
import { AsyncSelect } from "chakra-react-select";
import { useEffect, useState } from 'react';

import Card from 'components/atoms/Card'
import { getSkills, getSpecialities } from 'services/master-data';

export default function FilterPanel({
  sort,
  setSort = () => { },
  search,
  setSearch = () => { },
}) {

  const [specialities, setSpecialities] = useState([])
  const [filteredSpecialities, setFilteredSpecialities] = useState([])
  const [isLoadingSpecialities, setLoadingSpecialities] = useState(true)

  const [skills, setSkills] = useState([])
  const [filteredSkills, setFilteredSkills] = useState([])
  const [isLoadingSkills, setLoadingSkills] = useState(true)

  useEffect(() => {
    handleGetSpecialities({ firstLoad: true })
    handleGetSkills({ firstLoad: true })
  }, [])

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

  const handleSorting = (value) => {
    const splitted = value.split('-')
    var sortType = 'asc'
    if (splitted[1] && splitted[1] == 'za') sortType = 'desc'
    setSort({ by: splitted[0], type: sortType })
  }

  const handleOnKeyDownInput = (e) => {
    if (e.key === 'Enter') {
      setSearch({ ...search, search: e.target.value })
    }
  }

  return (
    <>
      <Flex w='full' justifyContent='space-between' alignItems='center'>
        <Text w='110px' fontSize='base'>Sort By :</Text>
        <Select
          variant='white'
          onChange={(e) => handleSorting(e.target.value)}
        >
          <option value='name-az'>Name A to Z</option>
          <option value='name-za'>Name Z to A</option>
        </Select>
      </Flex>

      <Card variant='solid' layerStyle='dashboardCard' position='relative' w='full'>
        <Box px={6} py={6}>
          <Heading as='h3' mb={8} fontSize='2xl'>Filters</Heading>
          <Input
            variant='white'
            mb={6}
            placeholder='Search by name'
            onKeyDown={handleOnKeyDownInput}
          />

          <Heading as='h3' mb='18px' fontSize='md'>Specialities</Heading>
          <AsyncSelect
            classNamePrefix="chakra-react-select"
            variant="filled"
            placeholder="Select specialities"
            cacheOptions
            isMulti
            closeMenuOnSelect={false}
            isLoading={isLoadingSpecialities}
            defaultOptions={specialities}
            loadOptions={(inputValue, callback) => {
              handleGetSpecialities({ name: inputValue })
              callback(filteredSpecialities)
            }}
            onChange={(option) => {        
              let specialitiesID = []
              option.forEach(el => {
                specialitiesID.push(el.value)
              });
              
              setSearch({ ...search, specialities: specialitiesID })
            }}
          />

          <Heading as='h3' mb='18px' fontSize='md' mt={6}>Skills</Heading>
          <AsyncSelect
            classNamePrefix="chakra-react-select"
            variant="filled"
            placeholder="Select skills"
            cacheOptions
            isMulti
            closeMenuOnSelect={false}
            isLoading={isLoadingSkills}
            defaultOptions={skills}
            loadOptions={(inputValue, callback) => {
              handleGetSkills({ name: inputValue })
              callback(filteredSkills)
            }}
            onChange={(option) => {        
              let skillsID = []
              option.forEach(el => {
                skillsID.push(el.value)
              });
              
              setSearch({ ...search, skills: skillsID })
            }}
          />
        </Box>
      </Card>
    </>
  )
}
