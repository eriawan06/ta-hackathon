import { useState, useEffect, useCallback } from 'react'

import { Flex, Heading, Tag, Box } from '@chakra-ui/react'

import Alert from 'components/atoms/Alert'
import Card from 'components/atoms/Card'
import LoadingOverlay from 'components/molecules/LoadingOverlay'
import PaymentPanelStep1 from 'components/organisms/Dashboard/PaymentPanel/PaymentPanelStep1'
import PaymentPanelStep2 from 'components/organisms/Dashboard/PaymentPanel/PaymentPanelStep2'
import PaymentPanelStep3 from 'components/organisms/Dashboard/PaymentPanel/PaymentPanelStep3'

import { useLatestEvents } from 'hooks/swr/events'
import { useParticipantProfile } from 'hooks/swr/users'
import { useParticipantInvoice } from 'hooks/swr/payments'
import DashboardMainLayout from 'layouts/DashboardMainLayout'

DashboardPayment.getLayout = (page) => {
  return <DashboardMainLayout pageTitle='Payment'>{page}</DashboardMainLayout>
}

export default function DashboardPayment() {
  const [isPaid, setIsPaid] = useState(false)
  const [step, setStep] = useState(1)

  const { data: latestEvent, isLoading: isLatestEventLoading } = useLatestEvents()

  const {
    data: participantProfile,
    isLoading: isParticipantProfileLoading,
    mutate: mutateParticipantProfile
  } = useParticipantProfile()

  const {
    data: participantInvoice,
    isLoading: isParticipantInvoiceLoading
  } = useParticipantInvoice(participantProfile?.id, latestEvent?.id)

  // PAYMENT STEP HANDLER
  useEffect(() => {
    if (participantInvoice?.status === 'processing') {
      setStep(3)
      return
    }

    setIsPaid(participantInvoice?.status === 'paid')
  }, [participantInvoice])

  const handleStep1Complete = () => {
    setStep(2)
  }

  const handleStep2Complete = useCallback(() => {
    console.log('step 2 complete')
    setStep(3)

    // wait 5s and try to refetch participant profile
    setTimeout(() => mutateParticipantProfile(), 5000)
  }, [mutateParticipantProfile])

  // STATUS HELPER
  const isLoading =
    isLatestEventLoading ||
    isParticipantProfileLoading ||
    isParticipantInvoiceLoading

  return (
    <Card variant='solid' layerStyle='dashboardCard' w='full' p={8}>
      <Flex
        align='center'
        justify='space-between'
        wrap='nowrap'
        mb={8}
      >
        <Heading as='h3' fontSize='2xl'>
          Payment
        </Heading>

        <Box>
          <Tag
            size='lg'
            borderRadius={0}
            px={6}
            colorScheme={isPaid ? 'green' : 'gray'}
            variant={isPaid ? 'solid' : 'subtle'}
          >
            PAID
          </Tag>
          <Tag
            size='lg'
            borderRadius={0}
            colorScheme={isPaid ? 'gray' : 'red'}
            variant={isPaid ? 'subtle' : 'solid'}
          >
            UNPAID
          </Tag>
        </Box>
      </Flex>

      {isLoading && <LoadingOverlay />}

      {!isLoading && isPaid && (
        <Alert>
          Thank you for finishing the payment process. You may proceed with the
          next step.
        </Alert>
      )}

      {!isLoading && !isPaid && (
        <>
          {step === 1 && <PaymentPanelStep1 onComplete={handleStep1Complete} />}
          {step === 2 && <PaymentPanelStep2 onComplete={handleStep2Complete} />}
          {step === 3 && <PaymentPanelStep3 />}
        </>
      )}
    </Card>
  )
}
