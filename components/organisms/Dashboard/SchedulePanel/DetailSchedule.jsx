import { useEffect, useState } from 'react'

import {
    VStack,
    Box,
    AspectRatio,
    Heading,
    Text,
    Skeleton,
    Image,
    Flex,
    Card,
    Divider,
    Button,
} from '@chakra-ui/react'

import { BsCheck, BsClock, BsCalendar2 } from 'react-icons/bs'

import { getFormattedDate, getFormattedTime } from 'libs/dateFormatter'
import { useDetailSchedule } from 'hooks/swr/schedules'

// const schedule = {
//     "id": 7,
//     "event_id": 15,
//     "mentor_name": "Mentor Two",
//     "title": "Mentoring 1",
//     "held_on": "2023-08-22T10:00:00Z",
//     "mentor_occupation": "CHIEF TECHNOLOGY OFFICER",
//     "mentor_institution": "Company Five",
//     "mentor_avatar": "https://sagara-hackathon.s3.ap-southeast-3.amazonaws.com/avatars/mentors/07PIWC70B3.jpg",
// }

export default function DetailSchedule({ id, onBack }) {
    const { data: schedule, isLoading } = useDetailSchedule(id)

    const [scheduleDate, setScheduleDate] = useState()
    const [isSchedulePassed, setIsSchedulePassed] = useState(false)
    const [calendarURLParams, setCalendarURLParams] = useState()

    useEffect(() => {
        if (!schedule) return

        const date = new Date(schedule?.held_on)
        const isPassed = date < Date.now()
        const calendarURLParams = new URLSearchParams({
            action: 'TEMPLATE',
            text: schedule?.title,
            details: 'Hackathon by Sagara Technology',
            dates:
                date.toISOString().replace(/-|:|\.\d\d\d/g, '') +
                '/' +
                date.toISOString().replace(/-|:|\.\d\d\d/g, ''),
            ctz: 'Asia/Jakarta'
        }).toString()

        setScheduleDate(date)
        setIsSchedulePassed(isPassed)
        setCalendarURLParams(calendarURLParams)
    }, [schedule])

    

    return (
        <VStack>
            <Box w='full'>
                <Heading as='h3' fontSize='2xl' px={12} py={8}>
                    Detail Schedule
                </Heading>
            </Box>

            <Skeleton isLoaded={!isLoading}>
                {
                    schedule &&
                    <Card
                        direction={{ base: 'column', sm: 'row' }}
                        w='full'
                        px={12}
                        mb={8}
                    >
                        <VStack mr={24}>
                            <Box px={16} mb={2} w='full'>
                                <AspectRatio ratio='1' w='full'>
                                    <Image
                                        name={schedule.mentor_name}
                                        src={schedule.mentor_avatar}
                                        fallbackSrc='/images/avatar-fallback.png'
                                        alt={schedule.mentor_name}
                                        borderRadius='full'
                                    />
                                </AspectRatio>
                            </Box>

                            <Box px={8} textAlign='center'>
                                <Skeleton isLoaded={!isLoading}>
                                    <Text as='p' fontSize='lg' fontWeight='bold' mb={2}>
                                        {schedule.mentor_name}
                                    </Text>
                                </Skeleton>

                                <Skeleton isLoaded={!isLoading}>
                                    <Text as='p' fontSize='sm' fontWeight='light'>
                                        {schedule.mentor_occupation}
                                    </Text>
                                </Skeleton>

                                <Skeleton isLoaded={!isLoading}>
                                    <Text as='p' fontSize='sm' fontWeight='light'>
                                        at {schedule.mentor_institution}
                                    </Text>
                                </Skeleton>
                            </Box>
                        </VStack>

                        <Box pb={5}>
                            <Box>
                                <Heading as='h3' size='md' mb={4}> {schedule.title}</Heading>
                                <Flex alignItems='center' gap={2} mb={2}>
                                    <BsCalendar2 />
                                    <Text fontSize='md'>{scheduleDate? getFormattedDate(scheduleDate) : '-'}</Text>
                                </Flex>

                                <Flex alignItems='center' gap={2} mb={5}>
                                    <BsClock />
                                    <Text fontSize='md'>
                                        {' '}
                                        {scheduleDate ? getFormattedTime(scheduleDate) : '-'} GMT+7
                                    </Text>
                                </Flex>

                                <Flex alignItems='center' gap={2} mb={5}>
                                    <Box w='full'>
                                        <Button
                                            as='a'
                                            href={`https://www.google.com/calendar/render?${calendarURLParams}`}
                                            target='_blank'
                                            rel='noopener rorefferer'
                                            variant='solid'
                                            colorScheme={isSchedulePassed ? 'gray' : 'red'}
                                            color='white'
                                            w='full'
                                            isDisabled={isSchedulePassed}
                                        >
                                            Remind Me
                                        </Button>
                                    </Box>
                                    <Box w='full'>
                                        <Button
                                            variant='outline'
                                            colorScheme='red'
                                            color='white'
                                            w='full'
                                            px={10}
                                            onClick={onBack}
                                        >
                                            Back
                                        </Button>
                                    </Box>
                                </Flex>
                            </Box>
                        </Box>
                    </Card>
                }
            </Skeleton>
        </VStack>
    )
}
