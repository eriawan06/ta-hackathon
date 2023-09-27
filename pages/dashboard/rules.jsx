import {
  Heading,
  VStack,
  HStack,
  Accordion,
  AccordionIcon,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react'

import Card from 'components/atoms/Card'
import LoadingOverlay from 'components/molecules/LoadingOverlay'
import { useEventRules } from 'hooks/swr/events'

import DashboardMainLayout from 'layouts/DashboardMainLayout'
import { getLatestEvent } from 'libs/local-storage/event'
import { useEffect, useState } from 'react'

DashboardRules.getLayout = (page) => {
  return <DashboardMainLayout pageTitle='Rules'>{page}</DashboardMainLayout>
}

export default function DashboardRules() {
  const [latestEvent, setLatestEvent] = useState()

  useEffect(() => {
    getLatestEvent().then((data) => {
      setLatestEvent(data)
    })
  }, [setLatestEvent])

  const {
    data: rules,
    isLoading
  } = useEventRules(latestEvent?.event_info?.id)


  return (
    <>
      <Card variant='solid' layerStyle='dashboardCard' w='full' p={8}>
        <Heading as='h3' mb={8} fontSize='2xl'>
          Rules
        </Heading>

        {isLoading && <LoadingOverlay />}

        {!isLoading &&
          <VStack alignItems='stretch' spacing={6} w='full'>
            {rules && rules.map((rule, i) => (
              <Accordion key={`rule-${i}`} allowToggle w='full' p={0} overflow='hidden'>
                <AccordionItem border='none'>
                  <AccordionButton p={0}>
                    <HStack>
                      <Center w='40px' h='40px' bg='rgb(229,62,62)' color='white'>
                        <Box as='span' fontWeight='bold' fontSize='lg'>{i + 1}</Box>
                      </Center>
                      <Button px={4} variant='solid' size='lg' colorScheme='transparent' w='full'>
                        <Text
                          as='span'
                          noOfLines={1}
                          display='block'
                          w='full'
                          textAlign='left'
                          fontWeight='bold'
                          fontSize='md'
                        >
                          {rule.title}
                        </Text>
                      </Button>
                    </HStack>
                  </AccordionButton>
                  <AccordionPanel bg='transparent' py={4} px={4}>
                    <Text as='p' fontWeight='light' fontSize='md' px={10}>{rule.note}</Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            ))}
          </VStack>
        }
      </Card>
    </>
  )
}
