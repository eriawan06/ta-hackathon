import { useEffect, useState } from 'react'

import {
  Box,
  SimpleGrid,
  Skeleton,
  Text,
  VStack
} from '@chakra-ui/react'

import BankButton from 'components/molecules/Dashboard/BankButton'

import { useLatestEvents } from 'hooks/swr/events'

import { getFormattedDate, getFormattedTime } from 'libs/dateFormatter'
import { getFormattedIDR } from 'libs/currencyFormatter'

export default function PaymentPanelStep1({ onComplete }) {
  const { data: latestEvent, isLoading: isLatestEventLoading } = useLatestEvents()
  const [isPaymentDue,  setIsPaymentDue] = useState(false)

  useEffect(() => {
    if (latestEvent !== null && latestEvent !== undefined) {
      const dueDate = new Date(latestEvent?.payment_due_date).getDate()
      if ((new Date().getDate()) >= (dueDate) ) {
        setIsPaymentDue(true)
      }
    }
  }, [latestEvent])

  const handleAutomatic = () => {

  }

  return (
    <div id='payment-panel-step-1'>
      <Text as='p' mb={8}>
        Choose payment methods:
      </Text>

      <SimpleGrid columns={2} spacing={12} mb={8}>
        <Box>
          <VStack align='stretch' gap={6}>
            <BankButton
              key='method-1'
              title='Manual'
              bankName='Bank Transfer'
              isDisabled={isPaymentDue}
              onClick={() => onComplete()}
            />
            <BankButton
              key='method-2'
              title='Automatic'
              bankName='Automatic Check Payment'
              isDisabled={true}
              onClick={() => handleAutomatic()}
            />
          </VStack>
        </Box>

        <Box pl={20}>
          <Box mb={8}>
            <Text
              as='span'
              display='block'
              fontSize='sm'
              mb={2}
            >
              Pay Before
            </Text>

            <Skeleton isLoaded={!isLatestEventLoading}>
              <Text as='strong' fontSize='xl'>
                {latestEvent?.payment_due_date
                  ? getFormattedDate(new Date(latestEvent?.payment_due_date))
                  : '-'}
              </Text>
              <br />
              {latestEvent?.payment_due_date &&
                <Text as='strong' fontSize='xl'>
                  {getFormattedTime(new Date(latestEvent?.payment_due_date))} GMT+7
                </Text>}
            </Skeleton>
          </Box>

          <Box mb={8}>
            <Text
              as='span'
              display='block'
              fontSize='sm'
              mb={2}
            >
              Amount
            </Text>

            <Skeleton isLoaded={!isLatestEventLoading}>
              <Text
                as='strong'
                fontSize='xl'
              >
                {latestEvent?.reg_fee
                  ? getFormattedIDR(latestEvent.reg_fee)
                  : '-'}
              </Text>
            </Skeleton>
          </Box>
        </Box>
      </SimpleGrid>
    </div>
  )
}
