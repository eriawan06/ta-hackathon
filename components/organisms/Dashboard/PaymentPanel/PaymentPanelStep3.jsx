import Alert from 'components/atoms/Alert'

import { useParticipantInvoice } from 'hooks/swr/payments'
import { useParticipantProfile } from 'hooks/swr/users'
import { useLatestEvents } from 'hooks/swr/events'

export default function PaymentPanelStep3() {
  const { data: participantProfile } = useParticipantProfile()
  const { data: latestEvent } = useLatestEvents()

  const { data: participantInvoice } = useParticipantInvoice(
    participantProfile.id,
    latestEvent.id
  )
  return (
    <div id='payment-panel-step-3'>
      <Alert as='p'>
        Your payment is being processed, please check back in few moments. Your
        invoice number is: {participantInvoice?.invoice_number}
      </Alert>
    </div>
  )
}
