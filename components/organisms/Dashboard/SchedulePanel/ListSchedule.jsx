import { useEffect, useState } from 'react'

import {
    Box,
    Button,
    Heading,
    Icon,
    Text,
    Flex,
    ListItem,
    UnorderedList,
    Avatar,
    VStack,
    Card,
    Skeleton
} from '@chakra-ui/react'

import { BsCheck, BsClock, BsCalendar2 } from 'react-icons/bs'

import Alert from 'components/atoms/Alert'

import { useEventSchedules } from 'hooks/swr/events'

import { getFormattedDate, getFormattedTime } from 'libs/dateFormatter'
import { getLatestEvent } from 'libs/local-storage/event'

export default function ListSchedule({ openDetail }) {
    const [latestEvent, setLatestEvent] = useState()

    useEffect(() => {
      getLatestEvent().then((data) => {
        setLatestEvent(data)
      })
    }, [setLatestEvent])
  
    const {
      data: scheduleItems,
      isLoading
    } = useEventSchedules(latestEvent?.event_info?.id)

    return (
        <VStack>
            <Box w='full'>
                <Heading as='h3' fontSize='2xl' px={12} py={8}>
                    Schedule
                </Heading>
            </Box>
            <Card
                border='none'
                bg='transparent'
                px={12}
                pt={4}
                pb={28}
                mb={8}
                w='full'
                maxHeight='485px'
                overflow='hidden'
                overflowY='auto'
            >
                <Skeleton isLoaded={!isLoading}>
                    {scheduleItems && scheduleItems.length === 0 ? (
                        <Alert as='p'>
                            There are currently no scheduled event for you. We will keep you
                            updated as soon as an event pops up!
                        </Alert>
                    ) : (
                        scheduleItems && scheduleItems.map((item, i) => {
                            const date = new Date(item.held_on)
                            const isPassed = date < Date.now()

                            const calendarURLParams = new URLSearchParams({
                                action: 'TEMPLATE',
                                text: item.title,
                                details: 'Hackathon by Sagara Technology',
                                dates:
                                    date.toISOString().replace(/-|:|\.\d\d\d/g, '') +
                                    '/' +
                                    date.toISOString().replace(/-|:|\.\d\d\d/g, ''),
                                ctz: 'Asia/Jakarta'
                            }).toString()

                            return (
                                <UnorderedList key={`schedule-${i}`} listStyleType='none'>
                                    <ListItem
                                        height='auto'
                                        position='relative'
                                        borderLeftWidth={i + 1 !== scheduleItems.length && 4}
                                        borderColor={isPassed ? '#DB0C2D' : '#fff'}
                                    >
                                        <Avatar
                                            bg={isPassed ? '#DB0C2D' : '#222121'}
                                            borderWidth={4}
                                            borderColor={isPassed ? '#DB0C2D' : '#fff'}
                                            color='#fff'
                                            position='absolute'
                                            left='-24px'
                                            top='-10px'
                                            icon={<Icon as={BsCheck} fontSize='4xl' />}
                                        />

                                        <Box ml={10} pb={5}>
                                            <Flex flexWrap='wrap' justifyContent='space-between'>
                                                <Box>
                                                    <Heading as='h3' size='md' mb={4}> {item.title}</Heading>
                                                    <Flex alignItems='center' gap={2} mb={2}>
                                                        <BsCalendar2 />
                                                        <Text fontSize='md'>{getFormattedDate(date)}</Text>
                                                    </Flex>

                                                    <Flex alignItems='center' gap={2}>
                                                        <BsClock />
                                                        <Text fontSize='md'>
                                                            {' '}
                                                            {getFormattedTime(date)} GMT+7
                                                        </Text>
                                                    </Flex>
                                                </Box>


                                                <VStack>
                                                    <Box w='full'>
                                                        <Button
                                                            variant='solid'
                                                            colorScheme='red'
                                                            color='white'
                                                            w='full'
                                                            onClick={() => openDetail(item.id)}
                                                        >
                                                            Detail
                                                        </Button>
                                                    </Box>
                                                    <Box w='full'>
                                                        <Button
                                                            as='a'
                                                            href={`https://www.google.com/calendar/render?${calendarURLParams}`}
                                                            target='_blank'
                                                            rel='noopener rorefferer'
                                                            variant='solid'
                                                            colorScheme={isPassed ? 'gray' : 'red'}
                                                            color='white'
                                                            w='full'
                                                            isDisabled={isPassed}
                                                        >
                                                            Remind Me
                                                        </Button>
                                                    </Box>
                                                </VStack>
                                            </Flex>
                                        </Box>
                                    </ListItem>
                                </UnorderedList>
                            )
                        })
                    )}
                </Skeleton>
            </Card>
        </VStack>
    )
}
