import { serviceGet, servicePost } from 'services/_config'

import { paymentsServiceURL as baseURL } from 'config'

export const ENDPOINT_PAYMENTS_PAYMENT = baseURL + '/payments/'

export const ENDPOINT_PAYMENTS_PAYMENT_METHODS = baseURL + '/payment-methods/'
export const ENDPOINT_PAYMENTS_ACTIVE_PAYMENT_METHODS =
  baseURL + '/payment-methods/active'

export const getPaymentMethods = serviceGet(ENDPOINT_PAYMENTS_PAYMENT_METHODS)
export const getActivePaymentMethods = serviceGet(
  ENDPOINT_PAYMENTS_ACTIVE_PAYMENT_METHODS
)

export const postPayment = servicePost(ENDPOINT_PAYMENTS_PAYMENT)
