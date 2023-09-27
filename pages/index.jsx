import NextLink from 'next/link'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  VStack,
  Skeleton
} from '@chakra-ui/react'

import ErrorOverlay from 'components/molecules/ErrorOverlay'
import AvatarCard from 'components/molecules/Landing/AvatarCard'
import AvatarCardStack from 'components/molecules/Landing/AvatarCardStack'
import Timeline from 'components/molecules/Landing/Timeline'
import Countdown from 'components/atoms/Countdown'

import LandingLayout from 'layouts/LandingLayout'

import { siteTitle } from 'config'
import Seo from 'components/atoms/Seo'
import { useHomeData } from 'hooks/swr/home'
import { setLatestEvent } from 'libs/local-storage/event'

Landing.getLayout = (page) => {
  return <LandingLayout>{page}</LandingLayout>
}

export default function Landing() {
  const { data, error, isLoading } = useHomeData()
  if (typeof window !== 'undefined') {
    setLatestEvent(data)
  }

  let untilDate = new Date().getTime()
  if (data?.event_info?.status === 'running') {
    untilDate = new Date(data?.event_info.start_date).getTime()
  }

  let judgeItems = []
  if (data?.event_judges !== undefined) {
    judgeItems = data?.event_judges
  }

  let mentorItems = []
  if (data?.event_mentors !== undefined) {
    mentorItems = data?.event_mentors
  }

  let timelineItems = []
  if (data?.event_timelines !== undefined) {
    timelineItems = data?.event_timelines
  }

  let companyItems = []
  if (data?.event_companies !== undefined) {
    companyItems = data?.event_companies
  }

  let faqItems = []
  if (data?.event_faqs !== undefined) {
    faqItems = data?.event_faqs
  }

  return (
    <>
      <Seo />

      <Skeleton isLoaded={!isLoading}>
        <Box id='landing-page'>
          {error && <ErrorOverlay>Unable to load user profile</ErrorOverlay>}
          <Container
            id='jumbotron'
            bgImage='/images/landing/jumbotron-bg.png'
            bgPosition='center'
            bgRepeat='no-repeat'
            bgSize='cover'
          >
            <Center
              py={12}
              textAlign='center'
            >
              <VStack
                align='center'
                spacing={12}
              >
                <Heading
                  as='h1'
                  fontSize={{ base: '5xl', lg: '7xl' }}
                >
                  {data?.event_info.name}
                </Heading>

                <Text
                  as='p'
                  maxW='60ch'
                >
                  Calling all tech enthusiasts across Indonesia — Sagara invites
                  you to join the thrill and become the changemaker in the
                  technology industry through <b>{data?.event_info.name}</b>
                </Text>

                <Countdown until={untilDate} />

                <NextLink
                  href='/auth/register'
                  passHref
                >
                  <Button
                    as='a'
                    size='lg'
                    colorScheme='red'
                  >
                    Register Now!
                  </Button>
                </NextLink>
              </VStack>
            </Center>
          </Container>

          <Container id='event'>
            <Flex
              wrap='wrap'
              justifyContent='center'
              alignItems='center'
              gap={12}
            >
              <Box>
                <Image
                  src='/images/landing/about-illustration.png'
                  fallbackSrc='/images/banner-fallback.png'
                  alt={siteTitle}
                  w='full'
                  maxW='40ch'
                />
              </Box>

              <VStack
                alignItems='stretch'
                maxW='60ch'
                spacing={6}
              >
                <Heading
                  as='h2'
                  fontSize='3xl'
                >
                  What is {data?.event_info.name}?
                </Heading>
                <Text as='p'>{data?.event_info.description}</Text>
              </VStack>
            </Flex>
          </Container>

          <Box
            id='judges'
            bgImage='/images/landing/judges-bg.png'
            bgPosition='top right'
            bgRepeat='no-repeat'
            bgSize='cover'
          >
            <Container>
              <Grid
                templateColumns={{ base: '1fr', lg: 'repeat(4, 1fr)' }}
                alignItems='center'
                gap={8}
              >
                <GridItem colSpan={1}>
                  <VStack
                    spacing='8'
                    alignItems='start'
                  >
                    <Heading
                      as='h2'
                      fontSize='3xl'
                    >
                      {' '}
                      Judges
                    </Heading>
                    <Text
                      as='p'
                      maxW='60ch'
                    >
                      Our judges will help to sharp innovative ideas towards
                      technologies issues we are facing.
                    </Text>
                  </VStack>
                </GridItem>

                <GridItem colSpan={3}>
                  <Container
                    overflow='hidden'
                    px={0}
                  >
                    <AvatarCardStack items={judgeItems} />
                  </Container>
                </GridItem>
              </Grid>
            </Container>
          </Box>

          <Container
            id='mentors'
            bgImage='/images/landing/mentors-bg.png'
            bgPosition='bottom left'
            bgRepeat='no-repeat'
            backgroundSize='cover'
          >
            <VStack spacing={6}>
              <Heading
                as='h2'
                fontSize='3xl'
              >
                Mentors
              </Heading>

              <Text
                as='p'
                maxW='60ch'
                textAlign='center'
              >
                Meet the talented pool of mentors who will be there assisting
                you along every step of the way.
              </Text>

              <Grid
                gridTemplateColumns={{
                  base: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)'
                }}
                alignItems='stretch'
                gap={8}
                w='full'
                pt={8}
              >
                {mentorItems.map((mentor, i) => (
                  <GridItem key={`mentor-${i}`}>
                    <AvatarCard
                      name={mentor.name}
                      occupation={mentor.occupation}
                      institution={mentor.institution}
                      avatar={mentor.avatar}
                    />
                  </GridItem>
                ))}
              </Grid>
            </VStack>
          </Container>

          <Container id='activity'>
            <VStack spacing={6}>
              <Box mb={12}>
                <Heading as='h2'>{data?.event_info.name} Timeline</Heading>
              </Box>

              <Box
                w='full'
                mt={8}
              >
                <Timeline items={timelineItems} />
              </Box>
            </VStack>
          </Container>

          <Container
            id='partner'
            bgImage='/images/landing/mentors-bg.png'
            bgPosition='bottom left'
            bgRepeat='no-repeat'
            backgroundSize='cover'
          >
            <VStack spacing={6}>
              <Heading
                as='h2'
                fontSize='3xl'
              >
                Sponsors & Partners
              </Heading>
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
                justify='center'
                gap={8}
                pt={8}
              >
                {companyItems.map((v, i) => (
                  <GridItem key={`partner-${i}`}>
                    <Image
                      src={v.logo}
                      alt='sponsor logo'
                      borderRadius='sm'
                      boxSize='250px'
                      objectFit='cover'
                    />
                  </GridItem>
                ))}
              </Grid>
            </VStack>
          </Container>

          <Container
            id='faq'
            bgImage='/images/landing/faq-bg.png'
            bgPosition='top right'
            bgRepeat='no-repeat'
            backgroundSize='cover'
          >
            <VStack spacing={6}>
              <Heading
                as='h2'
                fontSize='3xl'
                textAlign='center'
              >
                Frequently Asked Questions
              </Heading>

              <Text
                as='p'
                maxW='60ch'
                textAlign='center'
              >
                For those who has a lot of questons, worry not. Check below for
                some of the most common questions we've received.
              </Text>

              <VStack
                alignItems='stretch'
                spacing={6}
                w='full'
              >
                {faqItems.map((item, i) => (
                  <Accordion
                    key={`landing-faq-${i}`}
                    allowToggle
                    w='full'
                    p={0}
                    overflow='hidden'
                  >
                    <AccordionItem border='none'>
                      <AccordionButton
                        position='relative'
                        as='div'
                        p={0}
                        pl={4}
                      >
                        <Box
                          position='absolute'
                          left='0'
                          w={0}
                          h={0}
                          borderTop='0.5rem'
                          borderTopColor='transparent'
                          borderRight='1rem'
                          borderRightColor='white'
                          borderBottom='0.5rem'
                          borderBottomColor='transparent'
                          borderStyle='solid'
                        />
                        <Button
                          variant='solid'
                          size='lg'
                          colorScheme='white'
                          w='full'
                        >
                          <Flex
                            as='span'
                            justifyContent='space-between'
                            w='full'
                          >
                            <Text
                              as='span'
                              noOfLines={1}
                              display='block'
                              w='full'
                              textAlign='left'
                            >
                              {item.title}
                            </Text>
                            <AccordionIcon />
                          </Flex>
                        </Button>
                      </AccordionButton>
                      <AccordionPanel pt={8}>
                        <Heading
                          as='h5'
                          mb={4}
                          fontSize='lg'
                        >
                          {item.title}
                        </Heading>
                        <Text as='p'>{item.note}</Text>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                ))}
              </VStack>
            </VStack>
          </Container>
        </Box>
      </Skeleton>
    </>
  )
}
