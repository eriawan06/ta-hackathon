import { 
  Flex, 
  Box, 
  Image, 
  Text, 
  AspectRatio  
} from '@chakra-ui/react'

import {
  BsPinMap,
  BsPersonPlusFill,
  BsPersonDashFill,
  BsFillEyeFill,
  BsFillPersonFill
} from 'react-icons/bs'
import { PiSuitcaseLight } from 'react-icons/pi'
import { MdClose } from 'react-icons/md'
import { RiCheckLine } from 'react-icons/ri'

import Card from 'components/atoms/Card'
import capitalizeFirst from 'libs/stringLib'

export default function PreviewProfileCard({
  data,
  removeAction,
  acceptAction,
  declineAction,
  seeAction,
  inviteAction,
  removeOnClick,
  acceptOnClick,
  declineOnClick,
  seeOnClick,
  inviteOnClick,
  isAdmin,
  isSent,
  isAccepted,
  inlineBio = false
}) {
  return (
    <>
      <Card w='full' variant='solid' layerStyle='dashboardCard' minHeight='223px' borderRadius='12px' pb='15px'>
        <Box px='38px' py='18px' borderBottom='1px solid black'>
          <Flex gap='9px' w='full'>
            <Box w='63px' h='63px' borderRadius='100%' bgColor='white'>
              <AspectRatio ratio={1} >
                <Image
                  name={data.name}
                  src={data.avatar}
                  fallbackSrc='/images/avatar-fallback.png'
                  alt={data.name}
                  borderRadius='full'
                />
              </AspectRatio>
            </Box>
            <Flex gap={1} flexDirection='column' justifyContent='center' flexGrow='1'>
              <Flex justifyContent='space-between' alignItems='center'>
                <Text color='white' fontSize='16px' fontWeight='700'>{data?.name}</Text>
                <Flex gap='9px'>
                  {removeAction && (
                    <button
                      p={0}
                      m={0}
                      w='24px'
                      h='24px'
                      borderRadius='100%'
                      justifyContent='center'
                      alignItems='center'
                      cursor='pointer'
                      onClick={removeOnClick}
                    >
                      <BsPersonDashFill fontSize='20px' />
                    </button>
                  )}
                  {inviteAction && (
                    <button
                      p={0}
                      m={0}
                      w='24px'
                      h='24px'
                      borderRadius='100%'
                      justifyContent='center'
                      alignItems='center'
                      cursor='pointer'
                      onClick={inviteOnClick}
                    >
                      <BsPersonPlusFill fontSize='20px' />
                    </button>
                  )}
                  {acceptAction && (
                    <button
                      p={0}
                      m={0}
                      w='24px'
                      h='24px'
                      borderRadius='100%'
                      justifyContent='center'
                      alignItems='center'
                      cursor='pointer'
                      onClick={acceptOnClick}
                    >
                      <RiCheckLine fontSize='20px' />
                    </button>
                  )}
                  {declineAction && (
                    <button
                      p={0}
                      m={0}
                      w='24px'
                      h='24px'
                      borderRadius='100%'
                      bg='#e53e3e'
                      justifyContent='center'
                      alignItems='center'
                      cursor='pointer'
                      onClick={declineOnClick}
                    >
                      <MdClose fontSize='20px' />
                    </button>
                  )}
                  {seeAction && (
                    <button
                      p={0}
                      m={0}
                      w='24px'
                      h='24px'
                      borderRadius='100%'
                      bg='#ddd'
                      color='#333333'
                      justifyContent='center'
                      alignItems='center'
                      cursor='pointer'
                      onClick={seeOnClick}
                    >
                      <BsFillEyeFill fontSize='20px' />
                    </button>
                  )}
                </Flex>
              </Flex>
              <Flex gap='9px' alignItems='center'>
                <Box bgColor='#ddd' px='18px' fontSize='14px' borderRadius='18px' color='black'>
                  {data?.speciality_name}
                </Box>
                {isAdmin && (
                  <Box bgColor='#ddd' px='18px' fontSize='14px' borderRadius='18px' color='black'>
                    Admin
                  </Box>
                )}
                {isSent && (
                  <Box
                    bgColor='#ddd'
                    px='18px'
                    fontSize='14px'
                    borderRadius='18px'
                    color='black'
                  >
                    Sent
                  </Box>
                )}
                {isAccepted && (
                  <Box
                    bgColor='#ddd'
                    px='18px'
                    fontSize='14px'
                    borderRadius='18px'
                    color='black'
                  >
                    Accepted
                  </Box>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex gap='13px' pt='10px'>
            <Flex alignItems='center'>
              <BsPinMap fontSize='14px' color='white' />
              <Text ml='4px' color='white' fontSize='12px'>{capitalizeFirst(data?.city_name)}</Text>
            </Flex>
            <Flex alignItems='center'>
              <BsFillPersonFill fontSize='14px' color='white' />
              <Text ml='4px' color='white' fontSize='12px'>{capitalizeFirst(data?.gender)}</Text>
            </Flex>
            <Flex alignItems='center'>
              <PiSuitcaseLight fontSize='14px' color='white' />
              <Text ml='4px' color='white' fontSize='12px' >
                {data?.occupation_name} at {data?.institution ?? '-'}
              </Text>
            </Flex>
          </Flex>
        </Box>
        {/*  */}
        <Flex color='white' flexDirection={inlineBio ? 'row' : 'column'}>
          <Box px='38px' pt='10px'>
            <Box mb={3} fontSize='14px' fontWeight='bold'>
              <Text>Bio :</Text>
            </Box>
            <Text fontSize='14px'>
              {data?.bio ?? '-'}
            </Text>
          </Box>
          <Box px='38px' py='10px'>
            <Box mb={3} fontSize='14px' fontWeight='bold'>
              <Text>Skills :</Text>
            </Box>
            <Flex gap='7px' flexWrap='wrap'>
              {data?.skills.map((skill) => (
                <Flex
                  alignItems='center'
                  gap={2}
                  p={2}
                  bg='#ddd'
                  borderRadius='8px'
                  key={skill.skill_id}
                >
                  <Text
                    fontSize='14px'
                    color='black'
                  >
                    {skill.skill_name}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Card>
    </>
  )
}
