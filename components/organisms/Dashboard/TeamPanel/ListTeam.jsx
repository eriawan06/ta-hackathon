import { useEffect, useState } from 'react'
import NextLink from 'next/link'

import {
    Button,
    Heading,
    Text,
    Flex,
    Card,
    Skeleton,
    Input,
    AspectRatio,
    Image,
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react'

import PopupConfirmation from 'components/molecules/PopupConfirmation'
import { getListTeamByEvent, postTeamRequest } from 'services/teams'
// import { useLatestEvents } from 'hooks/swr/events'

import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useFormToast } from 'hooks/form-toast'

export default function ListTeam({ latestEvent, isLatestEventLoading, openDetail, openInvitation }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const { data: latestEvent, isLoading: isLatestEventLoading } = useLatestEvents()
    const [teams, setTeams] = useState([])
    const [isLoadingTeams, setIsLoadingTeams] = useState(false)
    const [search, setSearch] = useState()
    const [selectedTeam, setSelectedTeam] = useState()

    useEffect(() => {
        if (latestEvent) {
            handleGetListTeam({ search: '' })
        }
    }, [latestEvent])

    const handleGetListTeam = ({ search = '' }) => {
        setIsLoadingTeams(true)
        getListTeamByEvent(latestEvent?.id)({ order: 'id,asc', limit: 50, page: 1, q: search })
            .then((res) => {
                if (res && res.status === 200) {
                    const data = res.data.data.teams
                    setTeams(data)
                }
            })
        setIsLoadingTeams(false)
    }

    return (
        <>
            <PopupConfirmation
                header={`Request Join to ${selectedTeam?.name}`}
                body={PopupConfirmationBodyForm({ onClose, eventID: latestEvent?.id, teamID: selectedTeam?.id })}
                isOpen={isOpen}
                isForm
                onOpen={onOpen}
                onClose={onClose}
            />
            <Heading as='h3' fontSize='2xl' mb={8}>Teams</Heading>

            <Flex justifyContent='space-between' mb={8}>
                <Flex gap={4} mr={20} w='full'>
                    <Input
                        placeholder='Search team'
                        variant='white'
                        w='full'
                        pr={4}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button bg='gray' px={8} onClick={() => handleGetListTeam({ search })}>Find</Button>
                </Flex>

                <Flex gap={4}>
                    <Button
                        variant='outline'
                        colorScheme='red'
                        color='white'
                        px={6}
                        onClick={openInvitation}
                    >
                        Invitations
                    </Button>
                    <NextLink href='/dashboard/create-team' passHref>
                        <Button colorScheme='red' variant='solid'>+Create Team</Button>
                    </NextLink>
                </Flex>
            </Flex>

            <Card
                variant='solid'
                bg='gray.700'
                borderRadius='lg'
                w='full'
                maxHeight='500px'
                overflow='hidden'
                overflowY='auto'
                mb={20}
            >
                <Skeleton isLoaded={!isLatestEventLoading && !isLoadingTeams}>
                    {teams && teams.map((data, i) => (
                        <Flex
                            key={`team-${i}`}
                            w='full'
                            borderBottom='solid 1px white'
                            py={5}
                            px={8}
                            justifyContent='space-between'
                            alignItems='center'
                        >
                            <Flex gap={5} w='70%'>
                                <Box w='15%'>
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
                                <Flex direction='column' gap={3}>
                                    <Heading as='h3' fontSize='2xl'>{data.name}</Heading>
                                    <Flex gap={3} alignItems='center'>
                                        <Image
                                            src='/images/icon/participant-icon.png'
                                            alt='Sagara'
                                            h={8}
                                        />
                                        <Text>{data.num_of_member} / {latestEvent.team_max_member} participants</Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Flex gap={3}>
                                <Button colorScheme='gray' w='100px' onClick={() => openDetail(data.id)}>See</Button>
                                <Button
                                    colorScheme='red'
                                    w='100px'
                                    isDisabled={data.is_requested}
                                    onClick={() => {
                                        setSelectedTeam(data)
                                        onOpen()
                                    }}
                                >
                                    {data.is_requested? 'Requested' : 'Join'}
                                </Button>
                            </Flex>
                        </Flex>
                    ))}
                </Skeleton>
            </Card>
        </>
    )
}

function PopupConfirmationBodyForm({ onClose, eventID, teamID, }) {
    const initialValues = {
        event_id: eventID,
        team_id: teamID,
        note: ''
    }

    const validationSchema = Yup.object().shape({
        note: Yup.string().required('Required'),
    })

    const toast = useFormToast('requst-join-form')

    const handleSubmit = async (values, { resetForm }) => {
        toast.close()
        postTeamRequest(values)
            .then(() => {
                toast.send(
                    'success',
                    'Request Submitted!',
                    'Sucessfully submit a request to join the team.'
                )
            })
            .catch((err) => {
                let title = 'Form Error!'
                let message = err.message

                if (err.response?.status === 400) {
                    title = 'Request Failed!'
                    message = err.response?.data.error[0]
                    // message = 'Please make sure your input is valid and try again...'
                }

                toast.send('error', title, message)
            })
            .finally(() => {
                onClose()
            })
    }

    return (
        <Box pb={8}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting }) => (

                    <Form>
                        <FormControl
                            isRequired
                            isInvalid={touched.note && errors.note}
                        >
                            <FormLabel htmlFor='note'>Note</FormLabel>
                            <Field
                                as={Textarea}
                                variant='white'
                                id='note'
                                name='note'
                                type='text'
                                placeholder='Enter your note here...'
                            />

                            <FormErrorMessage>{errors.note}</FormErrorMessage>
                        </FormControl>

                        <Button
                            colorScheme='red'
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting}
                            w='full'
                            type='submit'
                            mt={5}
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>

    )
}