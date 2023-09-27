// TODO:
// - [x] Handle invite team member

import React from 'react'

import _ from 'lodash'

// import { useWindowSize } from 'usehooks-ts'

import {
  Heading,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightAddon,
  Progress,
  VStack,
  Card,
  Box,
  Select,
  Divider,
  AvatarGroup,
  Avatar,
  FormControl,
  FormLabel,
  FormHelperText
} from '@chakra-ui/react'

import DashboardProjectLayout from 'layouts/DashboardProjectLayout'
// import { useRouter } from 'next/router'
import { BsX, BsPlus, BsPeopleFill, BsXLg } from 'react-icons/bs'
import { FaClipboard, FaClipboardList, FaClipboardCheck } from 'react-icons/fa'

ProjectPage.getLayout = (page) => {
  return (
    <DashboardProjectLayout pageTitle='Create Team'>
      {page}
    </DashboardProjectLayout>
  )
}

/**
 *
 * @param { current: number, done: boolean[] } state
 * @param { type: 'NEXT' | 'PREV' | 'JUMP' | 'FINISH_CURRENT' | 'UNFINISH_CURRENT' } action
 * @returns { current, done }
 */
const StepReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT':
      return {
        ...state,
        current: state.current + 1
      }
    case 'PREV':
      return {
        ...state,
        current: state.current - 1
      }
    case 'JUMP':
      return {
        ...state,
        current: action.payload
      }
    case 'FINISH_CURRENT':
      return {
        ...state,
        done: state.done.map((item, index) => {
          if (index === state.current) {
            return true
          }
          return item
        })
      }
    case 'UNFINISH_CURRENT':
      return {
        ...state,
        done: state.done.map((item, index) => {
          if (index === state.current) {
            return false
          }
          return item
        })
      }
    default:
      return state
  }
}

const initStep = {
  current: 0,
  done: [false, false, false, false]
}

export default function ProjectPage() {
  // const router = useRouter();
  const [step, dispatchStep] = React.useReducer(StepReducer, initStep)
  // const { width, height } = useWindowSize()
  // const [step, setStep] = React.useState(0)
  // const [stepDone, setStepDone] = React.useState([false, false, false, false])
  return (
    <VStack
      spacing='8'
      w='100%'
    >
      <Heading as='h2'>Project</Heading>

      <Grid
        w='100%'
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(6, 1fr)',
          lg: 'repeat(3, 1fr)'
        }}
        gap={4}
      >
        <GridItem
          colSpan={{ base: '1' }}
          py='8px'
          px='16px'
          layerStyle='dashboardCard'
        >
          <Heading
            as='h3'
            size='md'
            mb='16px'
          >
            Progress
          </Heading>
          <Flex w='100%'>
            <Flex
              alignItems='center'
              gap='2'
              justifyContent='space-between'
              pos='relative'
              direction={{ base: 'row', md: 'column' }}
              h={{ md: '240px' }}
              w={{ base: '100%', md: '25%' }}
              overflow='hidden'
            >
              <Progress
                borderRadius='100px'
                pos='absolute'
                top='50%'
                left='50%'
                h={{ base: '12px', md: '12px' }}
                w={{ base: '100%', md: '240px' }}
                transform={{
                  base: 'translate(-50%, -50%)',
                  md: 'translate(-50%, -50%) rotate(90deg)'
                }}
                value={((step.current / 3) * 100).toFixed(2)}
                size='md'
                colorScheme='red'
              />
              <Button
                p='4px'
                borderRadius='100px'
                onClick={() => dispatchStep({ type: 'JUMP', payload: 0 })}
                colorScheme={
                  step.current === 0 ? 'white' : step.done[0] ? 'red' : 'black'
                }
              >
                <BsPeopleFill />
              </Button>
              <Button
                p='4px'
                borderRadius='100px'
                onClick={() => dispatchStep({ type: 'JUMP', payload: 1 })}
                colorScheme={
                  step.current === 1 ? 'white' : step.done[1] ? 'red' : 'black'
                }
              >
                <FaClipboard />
              </Button>
              <Button
                p='4px'
                borderRadius='100px'
                onClick={() => dispatchStep({ type: 'JUMP', payload: 2 })}
                colorScheme={
                  step.current === 2 ? 'white' : step.done[2] ? 'red' : 'black'
                }
              >
                <FaClipboardList />
              </Button>
              <Button
                p='4px'
                borderRadius='100px'
                onClick={() => dispatchStep({ type: 'JUMP', payload: 3 })}
                colorScheme={
                  step.current === 3 ? 'white' : step.done[3] ? 'red' : 'black'
                }
              >
                <FaClipboardCheck />
              </Button>
            </Flex>
            <Flex
              alignItems='start'
              gap='2'
              justifyContent='space-between'
              pos='relative'
              direction={{ base: 'row', md: 'column' }}
              h={{ md: '240px' }}
              w={{ md: '75%' }}
              py={{ md: '16px' }}
              overflow='hidden'
              display={{ base: 'none', md: 'flex' }}
            >
              <Heading
                as='h6'
                size='xs'
              >
                Manage Team
              </Heading>
              <Heading
                as='h6'
                size='xs'
              >
                Project Overview
              </Heading>
              <Heading
                as='h6'
                size='xs'
              >
                Project Details
              </Heading>
              <Heading
                as='h6'
                size='xs'
              >
                Submit
              </Heading>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem
          colSpan={{ base: '1', md: '5', lg: '2' }}
          layerStyle='dashboardCard'
          py={{ base: '8px', md: '24px' }}
          px={{ base: '16px', md: '32px' }}
        >
          <>
            {step.current === 0 && <ManageTeam />}
            {step.current === 1 && <ProjectOverview />}
            {step.current === 2 && <ProjectDetails />}
            {step.current === 3 && <Submit />}
          </>
        </GridItem>
      </Grid>

      <Flex
        justify='space-between'
        w='100%'
      >
        <Button
          type='button'
          variant='solid'
          colorScheme='red'
          onClick={() => {
            dispatchStep({ type: 'PREV' })
          }}
          isDisabled={step.current === 0}
        >
          Previous
        </Button>
        <Button
          type='button'
          variant='solid'
          colorScheme='red'
          onClick={() => {
            dispatchStep({ type: 'FINISH_CURRENT' })
            dispatchStep({ type: 'NEXT' })
          }}
        >
          {step.current === 3 ? 'Submit' : 'Next'}
        </Button>
      </Flex>
    </VStack>
  )
}

function ProjectDetails() {
  return (
    <VStack
      spacing={4}
      alignItems='start'
    >
      <Heading
        as='h2'
        size='lg'
        mb={4}
      >
        Project Details
      </Heading>
      <Heading
        as='h6'
        size='sm'
      >
        Project Name
      </Heading>
      <Input
        placeholder='Project Name'
        _placeholder={{ color: 'gray.500' }}
        bg='white'
        mb={4}
      />
      <Heading
        as='h6'
        size='sm'
      >
        Build With
      </Heading>
      <Input
        placeholder='Language, Frameworks'
        _placeholder={{ color: 'gray.500' }}
        bg='white'
        mb={4}
      />
      <Heading
        as='h6'
        size='sm'
      >
        Link
      </Heading>
      <Input
        placeholder='Github, URL Demo'
        _placeholder={{ color: 'gray.500' }}
        bg='white'
        mb={4}
      />
      <Heading
        as='h6'
        size='sm'
      >
        Video Demo Link
      </Heading>
      <Input
        placeholder='Youtube'
        _placeholder={{ color: 'gray.500' }}
        bg='white'
        mb='12px'
      />
    </VStack>
  )
}

const ProjectCategories = ['Security', 'Software', 'Open Source']

function ProjectOverview() {
  const fileInput = React.useRef(null)
  const [filename, setFilename] = React.useState('No File')

  const handleDrop = React.useCallback((event) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files) {
      if (fileInput.current) {
        fileInput.current.files = files
        setFilename(_.get(files, '[0].name', 'No File'))
      }
    }
  }, [])

  const handleDragOver = React.useCallback((event) => {
    event.preventDefault()
  }, [])

  React.useEffect(() => {
    setFilename(_.get(fileInput, 'current.files[0].name', 'No File'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileInput, fileInput.current, fileInput?.current?.files])

  return (
    <VStack
      spacing={4}
      alignItems='start'
    >
      <Heading
        as='h2'
        size='lg'
        mb={4}
      >
        Project Overview
      </Heading>
      <Heading
        as='h6'
        size='sm'
      >
        Project Name
      </Heading>
      <Input
        placeholder='Project Name'
        _placeholder={{ color: 'gray.500' }}
        color='gray.700'
        bg='white'
        mb={4}
      />
      <Heading
        as='h6'
        size='sm'
      >
        Project Theme
      </Heading>
      <Select
        placeholder='Project Theme'
        _placeholder={{ color: 'gray.500' }}
        bg='white'
        mb={4}
        color='gray.500'
      >
        {ProjectCategories.map((category) => {
          return (
            <option
              key={category}
              value={category}
              style={{
                backgroundColor: 'gray',
                color: 'white'
              }}
            >
              {category}
            </option>
          )
        })}
      </Select>
      <VStack
        bg='gray.700'
        spacing={4}
        borderRadius='8px'
        p='10px'
        w='100%'
        alignItems='start'
      >
        <Heading
          as='h6'
          size='sm'
        >
          Upload Thumbnail
        </Heading>
        <VStack
          bg='gray.600'
          border='2px'
          borderStyle='dashed'
          borderColor='gray.500'
          borderRadius='6px'
          alignItems='center'
          w='100%'
          py='96px'
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CloudUpload />
          <Flex
            fontSize='sm'
            color='gray.600'
          >
            <FormControl
              display='flex'
              flexDirection='column'
              alignItems='center'
            >
              <FormLabel
                color='white'
                textAlign='center'
                m='0'
              >
                Upload File
              </FormLabel>
              <Input
                ref={fileInput}
                type='file'
                pos='absolute'
                w='1px'
                h='1px'
                p='0px'
                m='-1px'
                overflow='hidden'
                clip='rect(0,0,0,0)'
                whiteSpace='nowrap'
                borderWidth='0'
              />
              <FormHelperText>or drag and drop.</FormHelperText>
            </FormControl>
          </Flex>
          <Input
            ref={fileInput}
            type='file'
            pos='absolute'
            w='1px'
            h='1px'
            p='0px'
            m='-1px'
            overflow='hidden'
            clip='rect(0,0,0,0)'
            whiteSpace='nowrap'
            borderWidth='0'
          />
          {filename !== 'No File' ? (
            <Button
              type='button'
              colorScheme='red'
              onClick={() => {
                setFilename('No File')
                _.assign(fileInput.current, {
                  files: undefined
                })
              }}
            >
              {filename}
              <Box
                w='4px'
                h='0'
              />
              <BsXLg />
            </Button>
          ) : (
            ''
          )}
        </VStack>
      </VStack>
    </VStack>
  )
}

const defaultInviteList = ['argyazahra@gmail.com', 'someone@gmail.com']

function ManageTeam() {
  const inputInvitationRef = React.useRef(null)
  const [inviteList, setInviteList] = React.useState(defaultInviteList)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setInviteList([...inviteList, event.target.value])
      event.target.value = ''
    }
  }

  return (
    <VStack spacing={4}>
      <Heading
        as='h2'
        size='lg'
        mb={4}
      >
        Manage Team
      </Heading>
      <Heading
        as='h3'
        size='md'
        mb={2}
      >
        Invite Teammates
      </Heading>
      <VStack
        w='100%'
        p='8'
        spacing={4}
        borderRadius='md'
        bg='white'
        align={{ base: 'stretch', lg: undefined }}
      >
        {inviteList &&
          inviteList.map((invite, index) => (
            <Button
              key={`${index}${invite}`}
              borderRadius='md'
              colorScheme='red'
              variant='solid'
              rightIcon={<BsX />}
              px={4}
              onClick={() =>
                setInviteList([...inviteList.filter((_item, i) => i !== index)])
              }
            >
              {invite}
            </Button>
          ))}
        <InputGroup
          size='md'
          variant='unstyled'
          color='gray.700'
        >
          <Input
            ref={inputInvitationRef}
            placeholder='someonetoinvite@gmail.com'
            _placeholder={{ opacity: 0.8, color: 'inherit' }}
            onKeyDown={handleKeyDown}
          />
          <InputRightAddon>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setInviteList([...inviteList, inputInvitationRef.current.value])
                inputInvitationRef.current.value = ''
              }}
              colorScheme='red'
            >
              <BsPlus />
            </Button>
          </InputRightAddon>
        </InputGroup>
      </VStack>
      <Button
        borderRadius='md'
        colorScheme='red'
        variant='solid'
        w='100%'
      >
        Invite
      </Button>

      <Card
        variant='solid'
        bg='gray.700'
        position='relative'
        w='full'
      >
        <Box
          p={8}
          pb={4}
        >
          <Heading
            as='h3'
            fontSize='2xl'
          >
            Team Member
          </Heading>
        </Box>

        <Divider />

        <Box
          p={8}
          pt={4}
        >
          <AvatarGroup spacing={4}>
            {[0, 1, 2].map((i) => (
              <Avatar
                key={`team-member-placeholder-${i}`}
                src='/images/avatar-fallback.png'
              />
            ))}
          </AvatarGroup>
        </Box>
      </Card>
    </VStack>
  )
}

function Submit() {
  return (
    <VStack
      spacing={4}
      alignItems='start'
    >
      <TeamMemberReadOnly />
      <ProjectOverviewDataReadOnly />
      <ProjectDetailsReadOnly />
    </VStack>
  )
}

function CloudUpload() {
  return (
    <svg
      width='62'
      height='62'
      viewBox='0 0 62 62'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M31 0C25.8859 0.0160367 20.9462 1.86052 17.0733 5.20025C14.105 7.75775 11.9544 11.0902 11.4002 14.4344C4.90575 15.8681 0 21.5256 0 28.3572C0 36.2932 6.6185 42.625 14.6514 42.625H29.0625V22.1146L20.7468 30.4343C20.3829 30.7981 19.8895 31.0024 19.375 31.0024C18.8605 31.0024 18.3671 30.7981 18.0032 30.4343C17.6394 30.0704 17.4351 29.577 17.4351 29.0625C17.4351 28.548 17.6394 28.0546 18.0032 27.6907L29.6282 16.0657C29.8082 15.8853 30.022 15.7422 30.2574 15.6445C30.4928 15.5468 30.7452 15.4965 31 15.4965C31.2548 15.4965 31.5072 15.5468 31.7426 15.6445C31.978 15.7422 32.1918 15.8853 32.3718 16.0657L43.9968 27.6907C44.3606 28.0546 44.5649 28.548 44.5649 29.0625C44.5649 29.577 44.3606 30.0704 43.9968 30.4343C43.6329 30.7981 43.1395 31.0024 42.625 31.0024C42.1105 31.0024 41.6171 30.7981 41.2532 30.4343L32.9375 22.1146V42.625H49.166C56.1952 42.625 62 37.0837 62 30.1204C62 23.7809 57.1873 18.6155 51.0183 17.7436C50.0766 7.74613 41.4238 0 31 0ZM29.0625 56.1875V42.625H32.9375V56.1875C32.9375 56.7014 32.7334 57.1942 32.37 57.5575C32.0067 57.9209 31.5139 58.125 31 58.125C30.4861 58.125 29.9933 57.9209 29.63 57.5575C29.2666 57.1942 29.0625 56.7014 29.0625 56.1875Z'
        fill='white'
      />
    </svg>
  )
}

function TeamMemberReadOnly() {
  return (
    <Card
      variant='solid'
      bg='gray.700'
      position='relative'
      w='full'
    >
      <Box
        p={8}
        pb={4}
      >
        <Heading
          as='h3'
          fontSize='2xl'
        >
          Team Member
        </Heading>
      </Box>

      <Divider />

      <Box
        p={8}
        pt={4}
      >
        <AvatarGroup spacing={4}>
          {[0, 1, 2].map((i) => (
            <Avatar
              key={`team-member-placeholder-${i}`}
              src='/images/avatar-fallback.png'
            />
          ))}
        </AvatarGroup>
      </Box>
    </Card>
  )
}

function ProjectOverviewDataReadOnly() {
  return (
    <>
      <Heading
        as='h2'
        size='lg'
        mb={4}
      >
        Project Overview
      </Heading>
      <Heading
        as='h6'
        size='sm'
      >
        Project Name
      </Heading>
      <Input
        placeholder='Project Name'
        _placeholder={{ color: 'gray.500' }}
        color='gray.700'
        bg='white'
        mb={4}
        isDisabled
        isReadOnly
      />
      <Heading
        as='h6'
        size='sm'
      >
        Project Theme
      </Heading>
      <Select
        placeholder='Project Theme'
        _placeholder={{ color: 'gray.500' }}
        bg='white'
        mb={4}
        color='gray.500'
        disabled
        isDisabled
        isReadOnly
      >
        <option value='selected'>Selected Project Theme</option>
      </Select>
    </>
  )
}

function ProjectDetailsReadOnly() {
  return (
    <>
      <Heading
        as='h2'
        size='lg'
        mb={4}
      >
        Project Details
      </Heading>
      <Heading
        as='h6'
        size='sm'
      >
        Project Name
      </Heading>
      <Input
        placeholder='Project Name'
        _placeholder={{ color: 'gray.500' }}
        bg='white'
        mb={4}
        isDisabled
        isReadOnly
      />
      <Heading
        as='h6'
        size='sm'
      >
        Build With
      </Heading>
      <Input
        placeholder='Language, Frameworks'
        _placeholder={{ color: 'gray.500' }}
        bg='white'
        mb={4}
        isDisabled
        isReadOnly
      />
      <Heading
        as='h6'
        size='sm'
      >
        Link
      </Heading>
      <Input
        placeholder='Github, URL Demo'
        _placeholder={{ color: 'gray.500' }}
        bg='white'
        mb={4}
        isDisabled
        isReadOnly
      />
      <Heading
        as='h6'
        size='sm'
      >
        Video Demo Link
      </Heading>
      <Input
        placeholder='Youtube'
        _placeholder={{ color: 'gray.500' }}
        bg='white'
        mb='12px'
        isDisabled
        isReadOnly
      />
    </>
  )
}
