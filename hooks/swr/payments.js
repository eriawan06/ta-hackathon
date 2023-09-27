import useSWR from 'swr'

import { ENDPOINT_PAYMENTS_ACTIVE_PAYMENT_METHODS, ENDPOINT_PAYMENTS_PAYMENT_METHODS } from 'services/payments'
import { ENDPOINT_USERS } from 'services/users'
import { fetcher } from 'services/general'

export function useActivePaymentMethods() {
  const { data, error } = useSWR(
    ENDPOINT_PAYMENTS_PAYMENT_METHODS, 
    {order: 'id,asc', limit: 20, page: 1, status: 'active'},
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data
  }
}

export function useParticipantInvoice(participantID, eventID) {
  const { data, error, mutate } = useSWR(
    participantID && eventID
      ? `${ENDPOINT_USERS}/participants/${participantID}/events/${eventID}/invoice`
      : null,
    fetcher
  )

  return {
    data: data?.data?.data,
    error,
    isLoading: !error && !data,
    mutate
  }
}
